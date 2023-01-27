/**
 * rollup-plugin-chrome-extension
 *http://github.com/extend-chrome/rollup-plugin-chrome-extension
 */
export interface ManifestTypeV2 {
  manifest_version: 2;
  name: string;
  version: string;
  default_locale?: string | undefined;
  description?: string | undefined;
  icons?: chrome.runtime.ManifestIcons | undefined;
  author?: string | undefined;
  background?: {
    page?: string;
    persistent?: boolean;
    scripts: string[];
    service_worker?: string;
    type?: string;
  };
  browser_action?: {
    browser_style?: boolean;
    default_icon?: chrome.runtime.ManifestIcons | undefined;
    default_title?: string;
    default_popup?: string;
    theme_icons?: chrome.runtime.ManifestIcons[] | undefined;
  };
  // chrome_settings_overrides?: boolean;
  // chrome_url_overrides?: {
  //   bookmarks?: string;
  //   history?: string;
  //   newtab?: string;
  // };
  commands?:
    | {
        [name: string]: {
          suggested_key?:
            | {
                default?: string | undefined;
                windows?: string | undefined;
                mac?: string | undefined;
                chromeos?: string | undefined;
                linux?: string | undefined;
              }
            | undefined;
          description?: string | undefined;
        };
      }
    | undefined;
  content_pack?: any;
  content_scripts?:
    {
      matches: string[];
      all_frames?: boolean;
      css?: string[];
      exclude_globs?: string[];
      exclude_matches?: string[];
      include_globs?: string[];
      js?: string[];
      match_about_blank?: boolean;
      run_at?: "document_idle" | "document_start" | "document_end";
    }[];
  content_security_policy?: string;
  current_locale?: any;
  devtools_page?: string;
  externally_connectable?: {
    matches: string[];
    accepts_tls_channel_id?: boolean;
  };
  file_browser_handlers?:
    {
      id: string;
      default_title: string;
      file_filters: string[];
    }[];
  homepage_url?: string;
  import?: boolean;
  incognito?: "spanning" | "split" | "not_allowed";
  input_components?:
    {
      id: string;
      name: string;
      description: string;
      type: "ime" | "xkb";
      layouts: string[];
    }[];
  key?: string;
  // minimum_chrome_version?: string;
  nacl_modules?: 
    {
      path: string;
      mime_type: "video/w+" | "audio/w+" | "application/w+";
    }[];
  oauth2?: {
    client_id?: string;
    scopes?: string[];
  };
  offline_enabled?: boolean;
  omnibox?: {
    keyword: string;
  };
  optional_permissions?: [];
  options_ui?: {
    page: string;
    browser_style?: boolean;
    open_in_tab?: boolean;
  };
  page_action?: {
    browser_style?: boolean;
    default_icon?: chrome.runtime.ManifestIcons | undefined;
    default_title?: string;
    default_popup?: string;
    theme_icons?: chrome.runtime.ManifestIcons[] | undefined;
  };
  permissions?: chrome.runtime.ManifestPermissions[] | string[] | undefined;
  platforms?:
    | {
        nacl_arch?: string | undefined;
        sub_package_path: string;
      }[]
    | undefined;
  requirements?:
    | {
        "3D"?:
          | {
              features?: string[] | undefined;
            }
          | undefined;
        plugins?:
          | {
              npapi?: boolean | undefined;
            }
          | undefined;
      }
    | undefined;
  sandbox?:
    | {
        pages: string[];
        content_security_policy?: string | undefined;
      }
    | undefined;
  short_name?: string | undefined;
  signature?: {
    key: string;
    signature?: string;
  };
  spellcheck?: {
    dictionary_language?: string;
    dictionary_locale?: string;
    dictionary_format?: string;
    dictionary_path?: string;
  };
  storage?: {
    managed_schema?: string;
  };
  system_indicator?: {
    default_icon: chrome.runtime.ManifestIcons | undefined;
    default_title: string;
  };
  tts_engine?:
    | {
        voices: {
          voice_name: string;
          lang?: string | undefined;
          gender?: string | undefined;
          event_types?: string[] | undefined;
        }[];
      }
    | undefined;
  update_url?: string | undefined;
  version_name?: string | undefined;
  web_accessible_resources?: string[] | undefined;
}
