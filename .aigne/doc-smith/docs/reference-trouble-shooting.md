# Troubleshooting

This guide helps you diagnose and fix common issues when working with AIGNE WebSmith. If you encounter problems during generation, publishing, or configuration, check the scenarios below for solutions.

---

## Configuration Issues

### Error 1: "Config file not found"

**Error message:**
```
Config file not found: .aigne/web-smith/config.yaml
```

**Cause:** The configuration file doesn't exist at the expected location.

**Fix:** 
- Run `aigne web generate` (it will guide you to create the configuration automatically, then start generation)
- Or run `aigne web init` (it will guide you to create the configuration without starting generation)

---

### Error 2: "Error parsing config file"

**Error message:**
```
Error parsing config file: YAML syntax error at line 5, column 3: unexpected character
```

**Cause:** YAML syntax error in the configuration file (e.g., incorrect indentation, wrong colon, missing quotes).

**Fix:**
1. Check the line number mentioned in the error
2. Verify YAML syntax (use spaces, not tabs; use correct colon format)
3. Validate the file using a YAML validator
4. Re-run `aigne web generate`

---

### Error 3: Switching from `standard` to `singlePage` without `clear`

**Error message:**
```
Warning: Website structure mismatch detected. Generated pages may not match the new scale.
```

**Cause:** Changed `websiteScale` from `standard` to `singlePage` without running `clear` first, causing structure conflicts.

**Fix:**
1. Run `aigne web clear` to remove old generated files
2. Run `aigne web generate` to regenerate with the new scale
3. **Always run `clear` before `generate` when changing `websiteScale`**

---

### Error 4: "Invalid locale code"

**Error message:**
```
Error: Invalid locale code 'invalid'. Supported codes: en, zh, zh-TW, ja, ko, fr, de, es, pt, ru, it, ar
```

**Cause:** Used an unsupported language code in `locale` or `translateLanguages`.

**Fix:**
1. Check the supported language codes list
2. Use a valid IETF language code (e.g., `en`, `zh`, `ja`)
3. Update the configuration and re-run the command

---

### Error 5: "No data sources found"

**Error message:**
```
Warning: No data sources found in sourcesPath. Generated content may be generic.
```

**Cause:** `sourcesPath` is empty or all specified paths don't exist or are inaccessible.

**Fix:**
1. Verify that files/directories in `sourcesPath` exist
2. Check file permissions (ensure files are readable)
3. Add valid paths to `sourcesPath` (e.g., `["./README.md", "./docs"]`)
4. Re-run `aigne web generate`

---

## Generation Issues

### Issue 1: Generated content doesn't match expectations

**Symptoms:**
- Content tone is off
- Structure doesn't follow requirements
- Missing key information

**Common causes:**
1. Insufficient or unclear `rules` in config
2. Misaligned `targetAudienceTypes`
3. Sparse or irrelevant `sourcesPath`

**Fix:**
1. **Enrich `rules`:** Add detailed guidance in your `config.yaml`:
   ```yaml
   rules: |
     ### Page Structure Requirements
     1. Above the fold must include:
        * Clear product headline
        * Concise description
        * Primary call-to-action
     
     ### Content Tone
     - Use positive, confident language
     - Include concrete data and examples
     - Avoid marketing jargon
   ```

2. **Adjust audience:** Ensure `targetAudienceTypes` matches your actual audience:
   ```yaml
   targetAudienceTypes:
     - customers      # For end users
     - developers     # For technical audience
   ```

3. **Add more sources:** Include relevant documentation in `sourcesPath`:
   ```yaml
   sourcesPath:
     - ./README.md
     - ./docs
     - ./CHANGELOG.md
   ```

---

### Issue 2: Images are low quality or missing

**Symptoms:**
- Low-resolution images in generated pages
- Expected images not appearing

**Cause:** `media.minImageWidth` threshold is filtering out images.

**Fix:**
1. Check current setting in `config.yaml`:
   ```yaml
   media:
     minImageWidth: 800  # Current threshold
   ```

2. Adjust based on your needs:
   - Lower (400-600): More images, lower quality risk
   - Medium (600-800): Balanced quality/quantity (recommended)
   - Higher (800-1000): Higher quality, fewer images

3. Apply changes:
   ```bash
   aigne web update
   ```

---

## Publishing Issues

### Issue 3: Publishing fails

**Symptoms:**
- Publish command fails
- Website not accessible after publish
- Authorization errors

**Common causes:**

**Cause 1: Missing or invalid `appUrl`**
```yaml
appUrl: ""  # Empty or invalid
```
**Fix:** Set a valid deployment URL:
```yaml
appUrl: https://your-site.user.aigne.io
```

**Cause 2: Authorization expired**
**Fix:** Re-authorize by running:
```bash
aigne web publish
```
Follow the browser prompts to re-authenticate.

**Cause 3: Network connection issues**
**Fix:**
1. Check your internet connection
2. Verify the target URL is accessible
3. Try again after a few minutes

---

## Translation Issues

### Issue 4: Translations are incorrect or incomplete

**Symptoms:**
- Missing translated pages
- Poor translation quality
- Mixed languages in output

**Fix:**

**For missing translations:**
1. Verify `translateLanguages` in config:
   ```yaml
   translateLanguages:
     - zh
     - ja
   ```

2. Run translate command:
   ```bash
   aigne web translate
   ```

**For poor quality:**
1. Ensure source content (in `locale` language) is finalized before translating
2. Use a glossary for consistent terminology
3. Review and refine translations manually if needed

---

## Performance Issues

### Issue 5: Generation takes too long

**Symptoms:**
- `aigne web generate` runs for extended periods
- System becomes unresponsive

**Common causes:**

**Cause 1: Too many data sources**
**Fix:** Reduce `sourcesPath` to essential files only:
```yaml
sourcesPath:
  - ./README.md
  - ./docs
  # Remove: ./node_modules (unnecessary)
  # Remove: ./dist (generated files)
```

**Cause 2: Large website scale**
**Fix:** Start with a smaller scale:
```yaml
websiteScale: minimal  # or singlePage
```

**Cause 3: Too many images**
**Fix:** Increase `minImageWidth` to filter out more images:
```yaml
media:
  minImageWidth: 1000  # Higher threshold
```

---

## Recovery Methods

### Method 1: Git revert

If you're using version control, restore the previous working configuration:

```bash
git revert HEAD
```

Then regenerate:
```bash
aigne web generate
```

---

### Method 2: Clean regeneration

Clear all generated files and regenerate from scratch:

```bash
aigne web clear && aigne web generate
```

This restores a clean state and regenerates your website based on the current configuration.

---

### Method 3: Restore from backup

If you have a backup configuration:

```bash
cp config-backup.yaml .aigne/web-smith/config.yaml
aigne web generate
```

---

### Method 4: Recreate configuration

If the config is severely broken:

1. Back up the current config:
   ```bash
   cp .aigne/web-smith/config.yaml config-broken.yaml
   ```

2. Recreate with the init wizard:
   ```bash
   aigne web init
   ```

3. Merge any custom values from the backup if needed

---

## Common YAML Format Errors

### Error: Full-width (Chinese) colon

**Wrong:**
```yaml
projectName： "My Project"  # Full-width colon
```

**Right:**
```yaml
projectName: "My Project"  # ASCII colon
```

---

### Error: Indentation issues

**Wrong:**
```yaml
pagePurpose:
- landingPage  # Missing indent
```

**Right:**
```yaml
pagePurpose:
  - landingPage  # Two-space indent
```

---

### Error: Wrong value types

**Wrong:**
```yaml
pagePurpose: landingPage  # String instead of array
```

**Right:**
```yaml
pagePurpose:
  - landingPage  # Array format
```

---

### Error: Missing quotes for special characters

**Wrong:**
```yaml
projectDesc: AI-powered tool: generates websites  # Colon without quotes
```

**Right:**
```yaml
projectDesc: "AI-powered tool: generates websites"  # Quoted
```

---

## Prevention Tips

1. **Use version control:** Track config changes with Git
2. **Make backups:** Copy config before major edits
3. **Validate changes:** Run `aigne web generate` after edits to catch errors early
4. **Use a YAML validator:** Check syntax before running commands
5. **Start small:** Test with minimal config before adding complexity
6. **Document changes:** Keep notes on what you changed and why

---

## Getting More Help

If you've tried the solutions above and still encounter issues:

1. **Check the documentation:** Review the [Config Reference](./reference-config.md) guide for detailed field descriptions

2. **Review command reference:** See [Command Reference](./reference-command.md) for detailed command usage

3. **Examine logs:** Check the terminal output for specific error messages

4. **Use Observability tools:** See below for how to capture detailed traces

5. **Community support:** Visit the [AIGNE Community](https://community.arcblock.io/discussions/boards/aigne) for help

---

## Using Observability for Debugging

When you need to report an issue or debug complex problems, WebSmith's observability feature captures detailed execution traces that help diagnose what went wrong.

### Start the Observability Server

Run the following command to start the local trace server:

```bash Start Observability Server icon=lucide:terminal
aigne observe --port 8888
```

You'll see output showing:
- Database path: where trace data is stored
- Server URL: the local address to access the observability dashboard

![Observability server running](../../../assets/images/web-smith-observe.png)

### View Trace Records

1. **Open the dashboard:** Click the server URL shown in the output or open it in your browser

2. **Browse traces:** The dashboard displays all WebSmith operations with:
   - Input/output tokens
   - Execution time
   - Function calls and their results
   - Error details

![Observability dashboard showing trace records](../../../assets/images/web-smith-observe-dashboard.png)

### Report Issues with Traces

When reporting problems to the community:

1. **Capture the trace:** Keep the observability server running during the problematic operation
2. **Download trace data:** Export the relevant trace record from the dashboard
3. **Report the issue:** Visit the [AIGNE Community](https://community.arcblock.io/discussions/boards/aigne) and attach:
   - Description of the problem
   - Steps to reproduce
   - Downloaded trace file
   - Your configuration (if relevant)

**Tip:** Traces contain detailed information about WebSmith's execution, making it much easier for the team to diagnose and fix issues.

---

## FAQ

**Q: Changes didn't take effect**
- **Causes:** Unsaved file, YAML errors, or need to regenerate
- **Fixes:** Save file, fix YAML, run `aigne web generate`, verify output

**Q: How to add languages?**
- Run `aigne web translate` and follow the prompts
- The command automatically updates `translateLanguages` in config

**Q: How to fix format errors?**
- **Common issues:** Full-width colons, inconsistent indentation, bad arrays
- **Fixes:** Follow YAML format examples above, restore from backup if needed

**Q: Site not publishing to expected URL?**
- **Check:** Verify `appUrl` in config matches your intended target
- **Fix:** Update `appUrl` and run `aigne web publish`

