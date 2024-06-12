import { useStyletron, type Theme } from 'baseui';
import { type StyleObject } from 'styletron-react';

export type StyletronCSSObjectValue =
  | StyleObject
  | ((theme: Theme) => StyleObject);

export type StyletronCSSObject = {
  [key: string]: StyletronCSSObjectValue;
};

// create type for specific CSSObject with all its keys available, this is more intellicense friendly that `type StyletronCSSObject`
export type StyletronCSSObjectOf<CSSObject> = {
  [K in keyof CSSObject]: StyletronCSSObjectValue;
};

// takes CSSObject and generates the type for its cls object
//Pick<StyletronCSSObject, Extract<keyof T, string>>
export type ClsObjectFor<CSSObject> = { [K in keyof CSSObject]: string };

export default function useStyletronClasses<
  T extends object = StyletronCSSObject,
>(s: StyletronCSSObjectOf<T>) {
  const [css, theme] = useStyletron();
  const cls = Object.entries<StyletronCSSObjectValue>(s).reduce<
    ClsObjectFor<T>
  >((result, [key, styles]) => {
    if (typeof styles === 'function') {
      result[key as keyof ClsObjectFor<T>] = css(styles(theme));
    } else {
      result[key as keyof ClsObjectFor<T>] = css(styles);
    }
    return result;
  }, {} as ClsObjectFor<T>);
  return { cls, theme };
}
