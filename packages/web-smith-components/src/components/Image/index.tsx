import { ColorPicker } from "@blocklet/pages-kit/builtin/color-picker";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import type { CSSProperties, FC, ImgHTMLAttributes } from "react";

export interface BlockProps {
  /** @description id: ZjzDYjhBGbSFjQvg | type: url | visible: true */
  src?:
    | string
    | {
        url: string;
        mediaKitUrl?: string;
        width?: number;
        height?: number;
      };
  /** @description id: IDcIJ2sD67Fv61NE | type: string | visible: true */
  altText?: string;
  /** @description id: awQrleg6KIaDKrAa | type: string | visible: true */
  width?: string;
  /** @description id: fa2HvV3PGuXyeATp | type: string | visible: true */
  height?: string;
  /** @description id: Rd0MqNe0AcwE7q7q | type: string | visible: true */
  objectFit?: string;
  /** @description id: 0jcm1hH9ubpOe5NX | type: string | visible: true */
  loading?: string;
  /** @description id: 1Lbvgfyz6qi6jkQk | type: string | visible: true */
  borderRadius?: string;
  /** @description id: knGtRCcMEvwf7zhT | type: color | visible: true */
  backgroundColor?: string;
}

const OBJECT_FIT_OPTIONS = ["cover", "contain", "fill", "scale-down", "none"] as const;
const LOADING_OPTIONS = ["lazy", "eager", "auto"] as const;

function resolveSrc(src: BlockProps["src"]): string {
  if (!src) {
    return "";
  }

  if (typeof src === "string") {
    return src;
  }

  return src.url || src.mediaKitUrl || "";
}

export default function BlockComponent({
  src,
  altText = "",
  width = "100%",
  height = "auto",
  objectFit = "cover",
  loading = "lazy",
  borderRadius = "0px",
  backgroundColor = "",
}: BlockProps) {
  const resolvedSrc = resolveSrc(src);

  if (!resolvedSrc) {
    return null;
  }

  const normalizedBackground = backgroundColor?.trim() || undefined;
  const normalizedBorderRadius = borderRadius?.trim() || undefined;
  const normalizedWidth = width?.trim() || "100%";
  const normalizedHeight = height?.trim() || "auto";

  return (
    <Box
      component="img"
      src={resolvedSrc}
      alt={altText}
      loading={loading as ImgHTMLAttributes<HTMLImageElement>["loading"]}
      sx={{
        display: "block",
        width: normalizedWidth,
        height: normalizedHeight,
        objectFit: objectFit as CSSProperties["objectFit"],
        borderRadius: normalizedBorderRadius,
        backgroundColor: normalizedBackground,
      }}
    />
  );
}

const ColorPickerField: FC<{
  label: string;
  value?: string;
  onChange: (value: string) => void;
}> = ({ label, value, onChange }) => (
  <Stack spacing={1}>
    <Typography variant="subtitle2" fontWeight={500}>
      {label}
    </Typography>
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 1,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <ColorPicker
        style={{ width: 24, height: 24 }}
        value={value}
        onChange={(color: unknown) => {
          if (typeof color === "string") {
            onChange(color);
            return;
          }

          if (color && typeof color === "object" && "hex" in color) {
            onChange((color as { hex?: string }).hex ?? "");
          }
        }}
      />
      <TextField
        size="small"
        fullWidth
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter color value"
      />
    </Box>
  </Stack>
);

export const EditComponent: FC<BlockProps & { onChange?: (value: BlockProps) => void }> = ({
  onChange,
  ...props
}) => {
  const handlePropChange = <K extends keyof BlockProps>(key: K, value: BlockProps[K]) => {
    if (!onChange) return;

    onChange({
      ...props,
      [key]: value,
    });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>, key: keyof BlockProps) => {
    handlePropChange(key, event.target.value);
  };

  const handleSrcChange = (value: string) => {
    if (!onChange) return;

    onChange({
      ...props,
      src: value
        ? typeof props.src === "object"
          ? { ...props.src, url: value, mediaKitUrl: value }
          : value
        : undefined,
    });
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <TextField
        label="Image URL"
        placeholder="https://example.com/image.png"
        value={typeof props.src === "string" ? props.src : props.src?.url || ""}
        onChange={(event) => handleSrcChange(event.target.value)}
        fullWidth
      />

      <TextField
        label="Alt Text"
        placeholder="Short description for accessibility"
        value={props.altText ?? ""}
        onChange={(event) => handlePropChange("altText", event.target.value)}
        fullWidth
      />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Width"
          value={props.width ?? "100%"}
          onChange={(event) => handlePropChange("width", event.target.value)}
          fullWidth
        />
        <TextField
          label="Height"
          value={props.height ?? "auto"}
          onChange={(event) => handlePropChange("height", event.target.value)}
          fullWidth
        />
      </Stack>

      <FormControl fullWidth size="small">
        <InputLabel id="image-object-fit-label">Object Fit</InputLabel>
        <Select
          labelId="image-object-fit-label"
          label="Object Fit"
          value={props.objectFit ?? "cover"}
          onChange={(event) => handleSelectChange(event, "objectFit")}
        >
          {OBJECT_FIT_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel id="image-loading-label">Loading</InputLabel>
        <Select
          labelId="image-loading-label"
          label="Loading"
          value={props.loading ?? "lazy"}
          onChange={(event) => handleSelectChange(event, "loading")}
        >
          {LOADING_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Border Radius"
        placeholder="e.g. 8px or 50%"
        value={props.borderRadius ?? "0px"}
        onChange={(event) => handlePropChange("borderRadius", event.target.value)}
        fullWidth
      />

      <ColorPickerField
        label="Background Color"
        value={props.backgroundColor ?? ""}
        onChange={(value) => handlePropChange("backgroundColor", value)}
      />
    </Stack>
  );
};
