import Balancer from "react-wrap-balancer";
import { ColorPicker } from "@blocklet/pages-kit/builtin/color-picker";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  type TypographyProps,
} from "@mui/material";
import type { FC } from "react";

export interface BlockProps {
  /** @description id: IQndxUYKc6NUVRCs | type: string | visible: true */
  text?: string;
  /** @description id: SrzC5Vp8SqYcJzUr | type: string | visible: true */
  variant?: string;
  /** @description id: QUYV511jm1ssmuLb | type: string | visible: true */
  component?: string;
  /** @description id: jo9jnfJAIDLDXiUo | type: string | visible: true */
  align?: string;
  /** @description id: ptpWizhLCdzt2NtH | type: string | visible: true */
  color?: string;
  /** @description id: B3mtlMBG1EQXTpVp | type: boolean | visible: true */
  gutterBottom?: boolean;
  /** @description id: CuhxDorq8ZA4DHLA | type: boolean | visible: true */
  noWrap?: boolean;
  /** @description id: u2Px0gyC6grJys99 | type: boolean | visible: true */
  balanceText?: boolean;
}

const TYPOGRAPHY_VARIANTS = [
  "inherit",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "subtitle1",
  "subtitle2",
  "body1",
  "body2",
  "button",
  "caption",
  "overline",
] as const;

const ALIGN_OPTIONS = [
  "inherit",
  "left",
  "center",
  "right",
  "justify",
] as const;

export default function BlockComponent({
  text = "",
  variant = "body1",
  align = "inherit",
  color = "initial",
  gutterBottom = false,
  noWrap = false,
  balanceText = false,
}: BlockProps) {
  if (!text) {
    return null;
  }

  const typographyProps: TypographyProps<"span"> = {
    variant: variant as TypographyProps["variant"],
    align: align as TypographyProps["align"],
    color: color as TypographyProps["color"],
    gutterBottom,
    noWrap,
  };

  return (
    <Typography {...typographyProps}>
      {balanceText ? <Balancer>{text}</Balancer> : text}
    </Typography>
  );
}

const ColorPickerField: FC<{
  value?: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <TextField
    size="small"
    fullWidth
    label="Color"
    value={value ?? ""}
    onChange={(event) => onChange(event.target.value)}
    placeholder="Enter color value"
    InputProps={{
      endAdornment: (
        <ColorPicker
          style={{ width: 24, height: 24 }}
          value={value ?? ""}
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
      ),
    }}
  />
);

export const EditComponent: FC<
  BlockProps & { onChange?: (value: BlockProps) => void }
> = ({ onChange, ...props }) => {
  const handlePropChange = <K extends keyof BlockProps>(
    key: K,
    value: BlockProps[K]
  ) => {
    onChange?.({
      ...props,
      [key]: value,
    });
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <ColorPickerField
        value={props.color}
        onChange={(value) => handlePropChange("color", value)}
      />

      <FormControl fullWidth size="small">
        <InputLabel id="typography-variant-label">Variant</InputLabel>
        <Select
          labelId="typography-variant-label"
          label="Variant"
          value={props.variant ?? "body1"}
          onChange={(event) => handlePropChange("variant", event.target.value)}
        >
          {TYPOGRAPHY_VARIANTS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small">
        <InputLabel id="typography-align-label">Align</InputLabel>
        <Select
          labelId="typography-align-label"
          label="Align"
          value={props.align ?? "inherit"}
          onChange={(event) => handlePropChange("align", event.target.value)}
        >
          {ALIGN_OPTIONS.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
};
