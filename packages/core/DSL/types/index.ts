import { Events } from "./events";
import { Props } from "./props";
import { Structure } from "./structure";
import { Styles } from "./styles";

export interface ComponentSpec {
  type: "button" | string;
  structure: Structure;
  styles: Styles;
  props: Props;
  events: Events;
}
