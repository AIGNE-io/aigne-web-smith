# 📹 How to Record Terminal Sessions for Player

This **Terminal Player component** uses the [asciinema](https://asciinema.org/) format for terminal recordings.  
Follow the steps below to create your own recordings that work perfectly with the Player.

---

## Step 1 — Install `asciinema` CLI

Install the asciinema command-line tool on your system:

```bash
# Install using pipx
pipx install asciinema

# Or with Homebrew on macOS
brew install asciinema

# Or with apt on Ubuntu/Debian
sudo apt install asciinema
```

---

## Step 2 — Record Your Terminal Session

⚠️ **Terminal Size Considerations**

- **Record with appropriate dimensions** — the terminal size during recording (`cols × rows`) determines the layout of your content.
- **Playback requirements** — the playback terminal must be at least as large as the recording dimensions to avoid wrapping or truncation.

```bash
# Start recording (creates demo.cast file)
asciinema rec demo.cast

# Run your terminal commands...
# Press Ctrl+D or type 'exit' to stop recording

# Play back locally to test
asciinema play demo.cast
```

💡 **Tip:** Plan your demo beforehand! The recording captures _everything_—including typos and pauses.

---

## Step 3 — Convert to Player Format

Once you have your `.cast` file, you can convert it into a JSON file that the Player component supports.  
You don’t need any extra tools—just use the online converter.

### 🎬 Online Converter & Live Preview

Upload your `.cast` file to instantly generate Player-compatible data and preview it live in your browser.

👉 **Go to:** [ArcBlock Terminal Player Converter](https://arcblock.github.io/ux/?path=/story/data-display-terminal-player--recording-guide)

**Features:**

- Drag & drop your `.cast` file or click to browse
- Live preview of your terminal playback
- Download the converted `.json` result
- No command-line tools required

---

## 🔗 Official Resources

- **asciinema Documentation:** [https://docs.asciinema.org/](https://docs.asciinema.org/)
- **File Format Specification:** [https://docs.asciinema.org/manual/file-format/](https://docs.asciinema.org/manual/file-format/)
- **Online Player:** [https://asciinema.org/](https://asciinema.org/)

---

### ✅ Summary

Use `asciinema` to record your terminal sessions, then visit  
**[ArcBlock’s Terminal Player Recording Guide](https://arcblock.github.io/ux/?path=/story/data-display-terminal-player--recording-guide)**  
to convert `.cast` files to the format required by the Player—no manual editing or schema knowledge needed.
