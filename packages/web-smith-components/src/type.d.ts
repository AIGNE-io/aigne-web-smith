export interface TextProps {
  id?: string;
  type?: 'text';
  text: string;
  style: {
    color?: string;
    fontSize?: string;
  };
}

export interface RichDescriptionProps {
  list: Array<
    | TextProps
    | {
        id?: string;
        type: 'image';
        url: string;
        alt?: string;
        width?: string;
        height?: string;
      }
    | {
        id?: string;
        type: 'link';
        text: string;
        color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
        variant?: 'text' | 'outlined' | 'contained' | 'icon';
        startIcon?: string;
        endIcon?: string;
        size?: 'small' | 'medium' | 'large';
        url: string;
        target?: '_blank' | '_self';
      }
  >;
}

export interface ImageProps {
  url: string;
  mediaKitUrl?: string;
  width?: string;
  height?: string;
}
