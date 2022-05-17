import { IsNotEmpty, IsString } from 'class-validator';

// I don't know where to define this type.
export type Message = { author: string; content: string };
// login; end of the restriction in ms.
export type restriction = { login: string; until: number };
