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
exports.installWin = void 0;
var core = __importStar(require("@actions/core"));
var exec = __importStar(require("@actions/exec"));
var tc = __importStar(require("@actions/tool-cache"));
var io = __importStar(require("@actions/io"));
var VULKAN_VERSION = '1.2.135.0';
var MESA_VERSION = '20.2.0-rc3';
// TODO: finish implementing windows installation
function installWin() {
    return __awaiter(this, void 0, void 0, function () {
        var githubWorkspacePath, libPath, vulkanSdkPath, vulkanRuntimePath, extracted, mesaTarPath, mesaSrcDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    githubWorkspacePath = process.env['GITHUB_WORKSPACE'];
                    libPath = githubWorkspacePath + "/lib";
                    return [4 /*yield*/, io.mkdirP(libPath)];
                case 1:
                    _a.sent();
                    core.info("Installing Vulkan SDK version v" + VULKAN_VERSION);
                    vulkanSdkPath = "C:/VulkanSDK/" + VULKAN_VERSION;
                    return [4 /*yield*/, exec.exec("echo \"::set-env name=VULKAN_SDK::" + vulkanSdkPath + "\"")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, exec.exec("echo \"::set-env name=VK_SDK_PATH::" + vulkanSdkPath + "\"")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, exec.exec("choco install vulkan-sdk --version=" + VULKAN_VERSION)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, tc.downloadTool("https://sdk.lunarg.com/sdk/download/" + VULKAN_VERSION + "/windows/vulkan-runtime-components.zip", './vulkan-runtime-components.zip')];
                case 5:
                    vulkanRuntimePath = _a.sent();
                    return [4 /*yield*/, tc.extractZip(vulkanRuntimePath, './vulkan-runtime-components')];
                case 6:
                    extracted = _a.sent();
                    return [4 /*yield*/, io.cp(extracted + "/VulkanRT-" + VULKAN_VERSION + "-Components/x64/.", libPath, { recursive: true })];
                case 7:
                    _a.sent();
                    core.info("Installing Mesa3D version v" + MESA_VERSION);
                    return [4 /*yield*/, exec.exec('choco install winflexbison pkgconfiglite').catch(function (reason) {
                            throw new Error("failed to install dependencies: '" + reason + "'");
                        })];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, exec.exec('python -m pip install scons wheel mako==0.8.0').catch(function (reason) {
                            throw new Error("failed to install python packages: '" + reason + "'");
                        })];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, tc.downloadTool("https://archive.mesa3d.org/mesa-" + MESA_VERSION + ".tar.xz", "./mesa-" + MESA_VERSION + ".tar.xz").catch(function (reason) {
                            throw new Error("failed to download Mesa3D tarball: '" + reason + "'");
                        })];
                case 10:
                    mesaTarPath = _a.sent();
                    return [4 /*yield*/, exec.exec("7z e -txz -y -r ./mesa-" + MESA_VERSION + ".tar.xz")];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, exec.exec("7z x -ttar -y ./mesa-" + MESA_VERSION + ".tar")];
                case 12:
                    _a.sent();
                    mesaSrcDir = "./mesa-" + MESA_VERSION + "/";
                    process.chdir(mesaSrcDir);
                    return [4 /*yield*/, exec.exec("scons").catch(function (reason) {
                            throw new Error("failed to build Mesa3D: '" + reason + "'");
                        })];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, exec.exec('ls -R ./build')];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, io.cp(mesaSrcDir + "lib64/.", libPath).catch(function (reason) {
                            throw new Error("failed to copy Mesa3D binaries: '" + reason + "'");
                        })];
                case 15:
                    _a.sent();
                    core.addPath(libPath);
                    throw new Error('failed to setup Mesa3D: \'Windows not supported (yet)\'');
            }
        });
    });
}
exports.installWin = installWin;
