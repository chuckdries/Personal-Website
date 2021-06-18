import { graphql } from 'gatsby';

export const VibrantColorsFragment = graphql`
  fragment VibrantColors on ImageSharpFieldsImageMetaVibrant {
    DarkMuted {
      titleTextColor
      bodyTextColor
      rgb
    }
    DarkVibrant {
      titleTextColor
      bodyTextColor
      rgb
    }
    LightMuted {
      titleTextColor
      bodyTextColor
      rgb
    }
    LightVibrant {
      titleTextColor
      bodyTextColor
      rgb
    }
    Vibrant {
      titleTextColor
      bodyTextColor
      rgb
    }
    Muted {
      titleTextColor
      bodyTextColor
      rgb
    }
  }
`;