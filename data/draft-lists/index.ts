import { Version } from "types/versions";
import { Pokemon } from "types/pokemon";

import { red } from "./red";
import { blue } from "./blue";
import { yellow } from "./yellow";
import { gold } from "./gold";
import { silver } from "./silver";
import { crystal } from "./crystal";
import { ruby } from "./ruby";
import { sapphire } from "./sapphire";
import { emerald } from "./emerald";

type Drafts = {
  [version in Version]: Pokemon[];
};

export const drafts: Drafts = {
  red,
  blue,
  yellow,
  gold,
  silver,
  crystal,
  ruby,
  sapphire,
  emerald,

  //TODO: Finish these fuckers

  firered: red,
  leafgreen: red,
  diamond: red,
  pearl: red,
  platinum: red,
  heartgold: red,
  soulsilver: red,
  black: red,
  white: red,
  "black-2": red,
  "white-2": red,
  x: red,
  y: red,
  "omega-ruby": red,
  "alpha-sapphire": red,
  sun: red,
  moon: red,
  "ultra-sun": red,
  "ultra-moon": red,
  "lets-go-pikachu": red,
  "lets-go-eevee": red,
  sword: red,
  shield: red,
  "brilliant-diamond": red,
  "shining-pearl": red,
};
