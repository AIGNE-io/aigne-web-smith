# Terminal Player

The Terminal Player is a specialized component used to display interactive, pre-recorded terminal sessions on your website. This component is an effective tool for demonstrating command-line instructions, showcasing software installations, or guiding users through technical processes in a clear and replayable format.

This component utilizes recordings created in the `asciinema` format, which ensures a lightweight, text-based capture of the terminal output.

## Overview of the Process

The workflow for using the Terminal Player can be broken down into a sequence of clear, manageable steps. The process begins with the developer recording a terminal session and concludes with the end-user viewing the interactive playback on the website.

```d2
direction: down

Developer: {
  shape: c4-person
}

Terminal: {
  label: "Terminal\n(with asciinema CLI)"
  shape: rectangle
}

Cast-File: {
  label: "my-demo.cast"
  shape: rectangle
}

Online-Converter: {
  label: "ArcBlock Online Converter"
  shape: rectangle
}

JSON-File: {
  label: "my-demo.json"
  shape: rectangle
}

Website-Project: {
  label: "Website Project"
  shape: rectangle

  Page-Config: {
    label: "Page YAML Configuration"
  }

  Terminal-Player-Component: {
    label: "TerminalPlayer Component"
  }
}

Website-Visitor: {
  shape: c4-person
}

Developer -> Terminal: "1. Record session"
Terminal -> Cast-File: "2. Generates"
Cast-File -> Online-Converter: "3. Upload & Convert"
Online-Converter -> JSON-File: "4. Download"
JSON-File -> Website-Project.Page-Config: "5. Referenced in config"
Website-Project.Page-Config -> Website-Project.Terminal-Player-Component: "Configures"
Website-Project.Terminal-Player-Component -> Website-Visitor: "6. Displays Playback"
```

## Creating a Terminal Recording

To use the Terminal Player, you must first create a recording file. The recommended tool for this is `asciinema`, an open-source command-line utility for recording and sharing terminal sessions.

### Step 1: Install the `asciinema` CLI

First, install the `asciinema` tool on your local machine. The installation method varies depending on your operating system.

```bash Installation icon=lucide:download
# On macOS using Homebrew
brew install asciinema

# On Ubuntu/Debian using APT
sudo apt install asciinema

# Using pipx (cross-platform)
pipx install asciinema
```

For additional installation options, please refer to the official [asciinema documentation](https://docs.asciinema.org/).

### Step 2: Record Your Session

Once `asciinema` is installed, you can begin recording a terminal session by executing the `rec` command.

```bash Recording Command icon=lucide:radio-tower
# Start a new recording, which will be saved to 'my-demo.cast'
asciinema rec my-demo.cast
```

After initiating the command, perform all the actions you wish to capture within your terminal. To stop the recording, press `Ctrl+D` or type the `exit` command. A file named `my-demo.cast` will be saved in your current directory. You can verify the playback locally by running `asciinema play my-demo.cast`.

**Important Considerations:**
*   **Plan your steps:** The recording captures all actions, including pauses and errors. It is advisable to prepare a script beforehand.
*   **Terminal Dimensions:** The player will replicate the column and row dimensions of the terminal used for recording. Ensure your terminal window is sized appropriately to prevent content wrapping or truncation during playback.

### Step 3: Convert the `.cast` File to JSON

The Terminal Player component requires the recording data to be in a specific JSON format. An online converter is available to simplify this conversion process.

1.  **Navigate to the Converter:** Open the [ArcBlock Terminal Player Converter](https://arcblock.github.io/ux/?path=/story/data-display-terminal-player--recording-guide) in your web browser.
2.  **Upload Your File:** Drag and drop your `.cast` file onto the page.
3.  **Preview and Download:** The tool will generate a live preview of your recording. After confirming it is correct, download the converted `.json` file.
4.  **Add to Project:** Place the downloaded JSON file into your website's media or assets directory.

## Using the Terminal Player Component

After creating and converting your recording, you can integrate the Terminal Player into any page by defining it in the page's configuration file. You will need to specify the path to your recording's JSON file and can optionally configure its layout.

### Configuration Example

The following is an example of how to configure a `TerminalPlayer` component within a page's data file.

```yaml Page Configuration Example icon=lucide:file-cog
# In your page's YAML configuration (e.g., page-name.yaml)

# ... other page content ...

sections:
  - component: TerminalPlayer
    props:
      # The title displayed above the terminal player
      title: "Live Demo"
      # A brief description of what the recording shows
      description: "This demo shows how to initialize a new AIGNE WebSmith project."
      # The relative path to your recording file
      recording: "/assets/data/my-demo.json"
      # (Optional) The layout of the component. Defaults to 'right'.
      layout: "left"

# ... other page sections ...
```

### Component Properties

The `TerminalPlayer` component accepts the following properties to customize its appearance and behavior.

| Property | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | Yes | A title for the component section. |
| `description` | `string` | No | A short description displayed alongside the title. |
| `recording` | `string` | Yes | The path to the JSON recording file. |
| `layout` | `string` | No | Determines the position of the text content relative to the player. Can be `left` or `right`. Defaults to `right`. |

## Summary

The Terminal Player component offers a robust method for demonstrating command-line workflows. By following the procedure of recording with `asciinema`, converting the file online, and configuring the component in your page data, you can produce engaging and informative technical tutorials for your users.

For further information, consult the official [asciinema website](https://asciinema.org/).