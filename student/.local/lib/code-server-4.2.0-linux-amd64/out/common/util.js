"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = exports.arrayify = exports.trimSlashes = exports.normalize = exports.generateUuid = exports.plural = exports.split = void 0;
/**
 * Split a string up to the delimiter. If the delimiter doesn't exist the first
 * item will have all the text and the second item will be an empty string.
 */
const split = (str, delimiter) => {
    const index = str.indexOf(delimiter);
    return index !== -1 ? [str.substring(0, index).trim(), str.substring(index + 1)] : [str, ""];
};
exports.split = split;
/**
 * Appends an 's' to the provided string if count is greater than one;
 * otherwise the string is returned
 */
const plural = (count, str) => (count === 1 ? str : `${str}s`);
exports.plural = plural;
const generateUuid = (length = 24) => {
    const possible = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    return Array(length)
        .fill(1)
        .map(() => possible[Math.floor(Math.random() * possible.length)])
        .join("");
};
exports.generateUuid = generateUuid;
/**
 * Remove extra slashes in a URL.
 *
 * This is meant to fill the job of `path.join` so you can concatenate paths and
 * then normalize out any extra slashes.
 *
 * If you are using `path.join` you do not need this but note that `path` is for
 * file system paths, not URLs.
 */
const normalize = (url, keepTrailing = false) => {
    return url.replace(/\/\/+/g, "/").replace(/\/+$/, keepTrailing ? "/" : "");
};
exports.normalize = normalize;
/**
 * Remove leading and trailing slashes.
 */
const trimSlashes = (url) => {
    return url.replace(/^\/+|\/+$/g, "");
};
exports.trimSlashes = trimSlashes;
/**
 * Wrap the value in an array if it's not already an array. If the value is
 * undefined return an empty array.
 */
const arrayify = (value) => {
    if (Array.isArray(value)) {
        return value;
    }
    if (typeof value === "undefined") {
        return [];
    }
    return [value];
};
exports.arrayify = arrayify;
// TODO: Might make sense to add Error handling to the logger itself.
function logError(logger, prefix, err) {
    if (err instanceof Error) {
        logger.error(`${prefix}: ${err.message} ${err.stack}`);
    }
    else {
        logger.error(`${prefix}: ${err}`);
    }
}
exports.logError = logError;
//# sourceMappingURL=util.js.map