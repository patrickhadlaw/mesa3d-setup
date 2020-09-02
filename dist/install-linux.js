"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installLinux = void 0;
var exec = __importStar(require("@actions/exec"));
var core = __importStar(require("@actions/core"));
var cache = __importStar(require("@actions/cache"));
var version_1 = require("./version");
var CONFIG_FILE = 'dummy.conf';
var SERVICE_FILE = 'xserver.service';
function execWithOutput(command) {
    return new Promise(function (resolve, reject) {
        var result = '';
        exec.exec(command, undefined, {
            listeners: {
                stdout: function (out) { return result += out.toString(); }
            }
        }).then(function (_) { return resolve(result); }).catch(function (e) { return reject(e); });
    });
}
function aptQueryFiles(pkg) {
    return new Promise(function (resolve, reject) {
        var result = [];
        exec.exec('apt-file', ['list', pkg], {
            listeners: {
                stdout: function (out) { return result.push(out.toString()); }
            }
        }).then(function (_) { return resolve(result); }).catch(function (e) { return reject(e); });
    });
}
function installLinux() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var vulkanVersion, mesaVersion, cacheFiles, _a, _b, _c, cacheName;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                core.startGroup('Add graphics repository');
                                return [4 /*yield*/, exec.exec('sudo apt install apt-file').catch(function (error) { return reject(error); })];
                            case 1:
                                _d.sent();
                                return [4 /*yield*/, exec.exec('sudo apt-get update')];
                            case 2:
                                _d.sent();
                                return [4 /*yield*/, exec.exec('sudo apt-get upgrade')];
                            case 3:
                                _d.sent();
                                return [4 /*yield*/, exec.exec('sudo add-apt-repository ppa:oibaf/graphics-drivers')];
                            case 4:
                                _d.sent();
                                core.endGroup();
                                core.startGroup('Check cache');
                                return [4 /*yield*/, execWithOutput("/bin/bash -c \"apt-cache show libvulkan1 | grep Version | cut -d ' ' -f2 | head -n 1\"").catch(function (error) { return reject(error); })];
                            case 5:
                                vulkanVersion = _d.sent();
                                return [4 /*yield*/, execWithOutput("/bin/bash -c \"apt-cache show mesa-vulkan-drivers | grep Version | cut -d ' ' -f2 | head -n 1\"").catch(function (error) { return reject(error); })];
                            case 6:
                                mesaVersion = _d.sent();
                                return [4 /*yield*/, aptQueryFiles('libvulkan1')];
                            case 7:
                                cacheFiles = _d.sent();
                                _b = (_a = cacheFiles.push).apply;
                                _c = [cacheFiles];
                                return [4 /*yield*/, aptQueryFiles('mesa-vulkan-drivers')];
                            case 8:
                                _b.apply(_a, _c.concat([_d.sent()]));
                                cacheName = version_1.VERSION + "-" + process.platform + "-vulkan" + vulkanVersion + "-mesa" + mesaVersion;
                                return [4 /*yield*/, cache.restoreCache(cacheFiles, cacheName)];
                            case 9:
                                if (!((_d.sent()) == null)) return [3 /*break*/, 13];
                                core.endGroup();
                                core.startGroup('Installing Vulkan SDK version latest');
                                return [4 /*yield*/, exec.exec("sudo apt install libvulkan1 vulkan-utils")];
                            case 10:
                                _d.sent();
                                core.endGroup();
                                core.startGroup('Installing Mesa3D version latest');
                                return [4 /*yield*/, exec.exec("sudo apt-get install mesa-vulkan-drivers")];
                            case 11:
                                _d.sent();
                                return [4 /*yield*/, cache.saveCache(cacheFiles, cacheName).catch(function (error) { return reject("failed to save cache: '" + error + "'"); })];
                            case 12:
                                _d.sent();
                                _d.label = 13;
                            case 13:
                                core.endGroup();
                                core.startGroup('Installing X server');
                                return [4 /*yield*/, exec.exec("sudo apt-get install xorg openbox xserver-xorg-video-dummy")];
                            case 14:
                                _d.sent();
                                return [4 /*yield*/, exec.exec("sudo cp " + __dirname + "/../" + CONFIG_FILE + " /etc/X11/xorg.conf")];
                            case 15:
                                _d.sent();
                                return [4 /*yield*/, exec.exec("sudo cp " + __dirname + "/../" + SERVICE_FILE + " /etc/systemd/system/" + SERVICE_FILE)];
                            case 16:
                                _d.sent();
                                return [4 /*yield*/, exec.exec("sudo systemctl daemon-reload")];
                            case 17:
                                _d.sent();
                                return [4 /*yield*/, exec.exec("sudo systemctl start xserver.service")];
                            case 18:
                                _d.sent();
                                core.endGroup();
                                resolve();
                                return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.installLinux = installLinux;
