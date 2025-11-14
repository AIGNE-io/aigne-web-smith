# Troubleshooting

This guide helps you diagnose and fix common issues when working with AIGNE WebSmith. If you encounter problems during generation, publishing, or configuration, check the scenarios below for solutions.

---

## Configuration Issues

### Issue 1: Error parsing config file

**Error message:**
```
Error: Failed to parse config file: Implicit map keys need to be followed by map values at line 112, column 1:

lastGitHead: c4a4d3db4bf230e2c6873419e26b6654c39613a5
appUrl: https://staging.websmith.aigne.io
```

```
Error: Failed to parse config file: Map keys must be unique at line 116, column 1:

projectCover: .aigne/web-smith/cover.png
appUrl: https://staging.websmith.aigne.io
^
```

**Cause:** YAML syntax error in the configuration file (e.g., incorrect indentation, wrong colon, missing quotes).

**Fix:**
1. Check the line number mentioned in the error message
2. Verify YAML syntax (use spaces, not tabs; use correct colon format)
3. Validate the file using a YAML validator
4. Re-run `aigne web publish`

---

Except for the above cases where the configuration file format is incorrect and needs to be handled, in other cases, if the correct parameters are not matched, the system will use default parameters to generate resources.

## Generation Issues

### Issue 2: Generated content doesn't match expectations

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

### Issue 3: Images are low quality or missing

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

### Issue 4: Missing or invalid `appUrl`

```
Error: ⚠️  The provided URL is not a valid website on ArcBlock platform

💡 Solution: Start here to set up your own website to host pages:
```

**Fix:** Set a valid deployment URL:
```yaml
# Write the correct URL
appUrl: https://your-site.user.aigne.io

# Or clear it and modify via CLI
# appUrl: ""
```

### Issue 5: Authorization expired

```
❌ Failed to publish pages: bundle: not authorized
```

**Fix:** Re-authorize by running the following commands:
```bash
# Clear invalid tokens and republish
aigne web clear
aigne web publish
```

---

## Recovery Methods

### Method 1: Git revert

If you're using version control, restore the previous working configuration:

```bash
git stash
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
