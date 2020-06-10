export interface PluginOptions {
  breakpoints: Record<string, number>;

  retinaSuffix?: string;
  cdnPrefix?: string;
  mobileFirst?: boolean;
}

export interface InnerOptions extends PluginOptions {
  retinaSuffix: string;
  cdnPrefix: string;
  mobileFirst: boolean;
}

interface BaseBreakpoint {
  sourceType?: string;
}

interface NamedBreakpoint extends BaseBreakpoint {
  name: string;
  kind: string;
  value: number;
}

export type Breakpoint = BaseBreakpoint | NamedBreakpoint;
