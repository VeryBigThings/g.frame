module.exports = {
    roots: [
        "<rootDir>/packages/"
    ],
    transform: {
        "^.+\\.ts$": "ts-jest"
    },
    // testRegex: "(/tests/.*.(test|spec)).(jsx?|tsx?)$",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    collectCoverage: false,
    coveragePathIgnorePatterns: [
        "(tests/.*.mock).(jsx?|tsx?)$"
    ],
    verbose: true
};
