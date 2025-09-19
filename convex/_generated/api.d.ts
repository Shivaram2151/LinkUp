/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as codeRooms from "../codeRooms.js";
import type * as comments from "../comments.js";
import type * as http from "../http.js";
import type * as interviews from "../interviews.js";
import type * as runCode from "../runCode.js";
import type * as submissions from "../submissions.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  codeRooms: typeof codeRooms;
  comments: typeof comments;
  http: typeof http;
  interviews: typeof interviews;
  runCode: typeof runCode;
  submissions: typeof submissions;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
