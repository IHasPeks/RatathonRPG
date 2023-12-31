/*:
 * @target MZ
 * @plugindesc Link Rpg maker MZ with Steam!
 * @author Maxii1996 (Based on Hudell CycloneSteam)
 * @url https://undermax.itch.io/
 *
 * @help
 * //////////////////////////////////////////////////////////////////////////////
 *               ___ _                  _    _      _   
 *              / __| |_ ___ __ _ _ __ | |  (_)_ _ | |__
 *              \__ \  _/ -_) _` | '  \| |__| | ' \| / /
 *              |___/\__\___\__,_|_|_|_|____|_|_||_|_\_\
 *                                     
 * \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
 * 
 * 
 *
 * The main system consists of two plugins to work properly:
 *
 * 1) "SteamLink.js" (This Plugin)
 * 2) "SteamLinkCommandsAddon"
 *
 * The SteamLink plugin provides the following script call implemented:
 * IMPORTANT: >> Without quotation marks <<
 *
 *    OLD METHOD (ADVANCED):
 * 
 * - "SteamLink.screenName": Returns your Steam name.
 * 
 * - "SteamLink.uiLanguage": Returns the name of your Steam UI Language.
 * 
 * - "SteamLink.gameLanguage": Returns the name of the language your game is configured to run on.
 * 
 * - "SteamLink.achievementCount": Returns the number of achievements configured on your game's App Admin.
 * 
 * - "SteamLink.running": Returns true or false, indicating if Steam is running.
 * 
 * - "SteamLink.overlayEnabled": Returns true or false, indicating if Steam overlay is enabled for your game.
 * 
 * - "SteamLink.dlcCount": Returns the number of DLCs configured on your game's App Admin.
 * 
 * - "SteamLink.friendCount": Returns the number of friends you have on Steam.
 * 
 * - "SteamLink.cloudEnabled": Returns true or false indicating if your game has Steam Cloud enabled on the App Admin.
 * 
 * - "SteamLink.userCloudEnabled": Returns true or false indicating if the player has Steam Cloud enabled for your game.
 * 
 * - "SteamLink.activateAchievement('ACHIEVEMENT_NAME')": Activates the specified achievement for the player.
 * 
 * - "SteamLink.getAchievement('ACHIEVEMENT_NAME')": Returns true or false indicating if the player has already activated the specified achievement.
 * 
 * - "SteamLink.clearAchievement('ACHIEVEMENT_NAME')": Deactivates the specified achievement for the player.
 * 
 * - "SteamLink.activateGameOverlay()": Activates the Steam overlay for your game. (IDK If this Works really)
 * 
 * - "SteamLink.activateGameOverlayToWebPage('https://www.google.com')": Opens the specified web page on the Steam overlay. (IDK If this Works really)
 * 
 * - "SteamLink.isDLCInstalled('DLC_NAME')": Returns true or false indicating if the specified DLC is installed.
 * 
 * - "SteamLink.installDLC('DLC_NAME'): Installs the specified DLC.
 * 
 * - "SteamLink.uninstallDLC('DLC_NAME')": Uninstalls the specified DLC.
 * 
 * - "SteamLink.getStatInt('STAT_NAME')": Returns the value of the specified integer stat. (IDK If this Works really)
 * 
 * - "SteamLink.getStatFloat('STAT_NAME')": Returns the value of the specified float stat. (IDK If this Works really)
 * 
 * - "SteamLink.setStat('STAT_NAME', value)": Sets the value of the specified stat. (IDK If this Works really)
 * 
 * - "SteamLink.storeStats()": Stores the current stats for the player. (IDK If this Works really)
 * 
 * - "SteamLink.isSubscribedApp('APP_ID')": Returns true or false indicating if the player is subscribed to the specified app ID.
 *
 * Make sure to have the "SteamLinkCommandsAddon" plugin installed and properly configured alongside this plugin.
 *
 * NEW METHOD (BASIC)
 * 
 * However, the new version implements these same commands so that they can be used from the 
 * graphical interface of the rpg maker editor and adapts them so that you can manage the information 
 * received in game variables.
 * 
 * To do this you simply have to use the "Add-on commands" from the event editor (In the third tab).
 * 
 * Select "SteamLinkCommandsAddon" from the list, and choose the command to use. 
 * The information will be saved in the variable that you choose right there.
 * 
 * It is important that before starting, within the "SteamLinkCommandsAddon" plugin, 
 * you reserve an exclusive variable to be able to compare "True" values.
 * 
 * This will allow you to compare if the value returned by the SteamLink command is true or 
 * false from the event conditions.
 * 
 * This variable will always have the value "True" and will be loaded when your game map loads.
 * Basically what you are asking is:
 * 
 * True = True or True = False (According to the case of the response 
 * received by the plugin) and from there act accordingly to what you need to do.
 * This is done so that you can use the Steam integration system in an easier way 
 * without knowing JS or handling script calls.
 * 
 * For more information watch the demo of this project to understand how things work.
 * 
 * INFORMATION:
 * 
 * This Demo is based on Windows (64 bit) and includes the "greenworks" files and the Steam "SDK" already incorporated.
 * Remember to copy these files to your project when you are going to use it.
 * They are in the "lib" folder and at the root of the project is simply the "greenworks.js" file.
 * 
 * DONE. HAPPY MAKING :)
 *   
*/
(function () {
'use strict';

globalThis.SteamLinkPatcher = class {
  static initialize(t) {
      this.pluginName = t, this.superClasses = new Map;
  }
  static _descriptorIsProperty(t) {
      return t.get || t.set || !t.value || "function" != typeof t.value
  }
  static _getAllClassDescriptors(t, e = !1) {
      if (t === Object) return {};
      const r = Object.getOwnPropertyDescriptors(e ? t.prototype : t);
      let s = {};
      if (t.prototype) {
          const r = Object.getPrototypeOf(t.prototype).constructor;
          r !== Object && (s = this._getAllClassDescriptors(r, e));
      }
      return Object.assign({}, s, r)
  }
  static _assignDescriptor(t, e, r, s, a = !1) {
      if (this._descriptorIsProperty(r)) r.get || r.set ? Object.defineProperty(t, s, {
          get: r.get,
          set: r.set,
          enumerable: r.enumerable,
          configurable: r.configurable
      }) : Object.defineProperty(t, s, {
          value: r.value,
          enumerable: r.enumerable,
          configurable: r.configurable
      });
      else {
          let r = s;
          if (a)
              for (; r in t;) r = `_${r}`;
          t[r] = e[s];
      }
  }
  static _applyPatch(t, e, r, s, a = !1) {
      const n = this._getAllClassDescriptors(t, a),
          i = a ? t.prototype : t,
          o = a ? e.prototype : e,
          l = Object.getOwnPropertyDescriptors(o);
      let u = !1;
      for (const t in l) {
          if (s.includes(t)) continue;
          if (t in n) {
              u = !0;
              const e = n[t];
              this._assignDescriptor(r, i, e, t, !0);
          }
          const e = l[t];
          this._assignDescriptor(i, o, e, t);
      }
      return u
  }
  static patchClass(t, e) {
      const r = this.superClasses && this.superClasses[t.name] || {},
          s = {},
          a = {},
          n = e(a, s);
      if ("function" != typeof n) throw new Error(`Invalid class patch for ${t.name}`);
      const i = Object.getOwnPropertyNames(class {}),
          o = Object.getOwnPropertyNames(class {}.prototype),
          l = this._applyPatch(t, n, r, i),
          u = this._applyPatch(t, n, s, o, !0);
      if (l) {
          const t = Object.getOwnPropertyDescriptors(r);
          for (const e in t) this._assignDescriptor(a, r, t[e], e);
          u && (a.$prototype = s);
      } else Object.assign(a, s);
      this.superClasses && (this.superClasses[t.name] = a);
  }
};
const t = Object.freeze(["TRUE", "ON", "1", "YES", "T", "V"]);
class e extends SteamLinkPatcher {
  static initialize(t) {
      super.initialize(t), this.fileName = void 0, this.params = {}, this.structs = new Map, this.eventListeners = new Map, this.structs.set("Dictionary", {
          name: {
              type: "string",
              defaultValue: ""
          },
          value: {
              type: "string",
              defaultValue: ""
          }
      });
  }
  static register(t = {}) {
      const e = this.loadAllParams();
      this.params = this.loadParamMap(t, e);
  }
  static loadAllParams() {
      for (const t of globalThis.$plugins) {
          if (!t || !t.status) continue;
          if (!t.description || !t.description.includes(`<pluginName:${this.pluginName}`)) continue;
          this.fileName = t.name;
          const e = new Map;
          for (const r in t.parameters) r && !r.startsWith("-") && e.set(r, t.parameters[r]);
          return e
      }
  }
  static loadParamMap(t, e) {
      const r = {};
      for (const s in t)
          if (t.hasOwnProperty(s)) try {
              r[s] = this.parseParam(s, t, e);
          } catch (t) {
              console.error(`SteamLinkEngine crashed while trying to parse a parameter value (${s}).:`), console.log(t);
          }
      return r
  }
  static registerEvent(t, e) {
      this.eventListeners.has(t) || this.eventListeners.set(t, new Set);
      this.eventListeners.get(t).add(e);
  }
  static removeEventListener(t, e) {
      if (!this.eventListeners.has(t)) return;
      this.eventListeners.get(t).delete(e);
  }
  static shouldReturnCallbackResult(t, {
      abortOnTrue: e,
      abortOnFalse: r,
      returnOnValue: s
  }) {
      return !(!1 !== t || !r) || (!(!0 !== t || !e) || !(void 0 === t || !s))
  }
  static runEvent(t, {
      abortOnTrue: e = !1,
      abortOnFalse: r = !1,
      returnOnValue: s = !1
  } = {}, ...a) {
      if (!this.eventListeners.has(t)) return;
      const n = this.eventListeners.get(t);
      for (const t of n) {
          if ("number" == typeof t) {
              this.runCommonEvent(t);
              continue
          }
          if ("function" != typeof t) {
              console.error("SteamLinkEngine: Invalid callback type:"), console.log(t);
              continue
          }
          const n = t(...a);
          if (this.shouldReturnCallbackResult(n, {
                  abortOnTrue: e,
                  abortOnFalse: r,
                  returnOnValue: s
              })) return n
      }
  }
  static runCommonEvent(t) {
      const e = globalThis.$dataCommonEvents[t];
      if (!e) return;
      const r = new Game_Interpreter(1);
      if (r.setup(e.list, 0), !this._interpreters) {
          this._interpreters = new Set;
          const t = SceneManager.updateMain;
          SceneManager.updateMain = () => {
              t.call(SceneManager), this.update();
          };
      }
      this._interpreters.add(r);
  }
  static update() {
      if (this._interpreters)
          for (const t of this._interpreters) t.update(), t.isRunning() || this._interpreters.delete(t);
  }
  static getPluginFileName() {
      return this.fileName ?? this.pluginName
  }
  static isTrue(e) {
      return "string" != typeof e ? Boolean(e) : t.includes(e.toUpperCase())
  }
  static isFalse(t) {
      return !this.isTrue(t)
  }
  static getIntParam({
      value: t,
      defaultValue: e
  }) {
      try {
          const r = parseInt(t);
          return isNaN(r) ? e : r
      } catch (r) {
          return "" !== t && console.error(`SteamLink Engine plugin ${this.pluginName}: Param is expected to be an integer number, but the received value was '${t}'.`), e
      }
  }
  static getFloatParam({
      value: t,
      defaultValue: e
  }) {
      try {
          const r = parseFloat(t.replace(",", "."));
          return isNaN(r) ? e : r
      } catch (r) {
          return "" !== t && console.error(`SteamLink Engine plugin ${this.pluginName}: Param is expected to be a number, but the received value was '${t}'.`), e
      }
  }
  static getIntListParam({
      value: t
  }) {
      return this.parseArray((t ?? "").trim(), (t => {
          try {
              return parseInt(t.trim())
          } catch (e) {
              return "" !== t && console.error(`SteamLink Engine plugin ${this.pluginName}: Param is expected to be a list of integer numbers, but one of the items was '${t}'.`), 0
          }
      }))
  }
  static parseStructArrayParam({
      data: t,
      type: e
  }) {
      const r = [];
      for (const s of t) {
          const t = this.parseStructParam({
              value: s,
              defaultValue: "",
              type: e
          });
          t && r.push(t);
      }
      return r
  }
  static getFloatListParam({
      value: t
  }) {
      return this.parseArray((t || "").trim(), (t => {
          try {
              return parseFloat(t.trim())
          } catch (e) {
              return "" !== t && console.error(`SteamLink Engine plugin ${this.pluginName}: Param ${name} is expected to be a list of numbers, but one of the items was '${t}'.`), 0
          }
      }))
  }
  static getParam({
      value: t,
      defaultValue: e,
      type: r
  }) {
      if (r.endsWith("[]")) return this.parseArrayParam({
          value: t,
          type: r
      });
      if (r.startsWith("struct<")) return this.parseStructParam({
          value: t,
          defaultValue: e,
          type: r
      });
      if (void 0 === t) return e;
      switch (r) {
          case "int":
              return this.getIntParam({
                  value: t,
                  defaultValue: e
              });
          case "float":
              return this.getFloatParam({
                  value: t,
                  defaultValue: e
              });
          case "boolean":
              return "boolean" == typeof t ? t : this.isTrue(String(t).trim());
          default:
              return t
      }
  }
  static getPluginParam(t) {
      return this.params.get(t)
  }
  static defaultValueForType(t) {
      switch (t) {
          case "int":
              return 0;
          case "boolean":
              return !1
      }
      return ""
  }
  static parseParam(t, e, r) {
      let s = e[t];
      s && "string" == typeof s && (s = {
          type: s,
          defaultValue: this.defaultValueForType(s)
      });
      const {
          name: a = t,
          type: n = "string",
          defaultValue: i = ""
      } = s;
      let o;
      if (r) o = r.get(a) ?? i;
      else {
          o = (this.getPluginParam(a) || {}).value ?? i;
      }
      return this.getParam({
          value: o,
          defaultValue: i,
          type: n
      })
  }
  static parseArrayParam({
      value: t,
      type: e
  }) {
      const r = this.parseArray(t);
      if (!r || !r.length) return r;
      const s = e.substr(0, e.length - 2),
          a = [];
      for (const t of r) {
          const e = this.defaultValueForType(s);
          a.push(this.getParam({
              value: t,
              type: s,
              defaultValue: e
          }));
      }
      return a
  }
  static getRegexMatch(t, e, r) {
      const s = t.match(e);
      if (s) return s[r]
  }
  static parseStructParam({
      value: t,
      defaultValue: e,
      type: r
  }) {
      let s;
      if (t) try {
          s = JSON.parse(t);
      } catch (e) {
          console.error("SteamLink Engine failed to parse param structure: ", t), console.error(e);
      }
      s || (s = JSON.parse(e));
      const a = this.getRegexMatch(r, /struct<(.*)>/i, 1);
      if (!a) return console.error(`Unknown plugin param type: ${r}`), s;
      const n = this.structs.get(a);
      if (!n) return console.error(`Unknown param structure type: ${a}`), s;
      for (const t in n) {
          if (!n.hasOwnProperty(t)) continue;
          let e = n[t];
          "string" == typeof e && (e = {
              type: e,
              defaultValue: this.defaultValueForType(e)
          }), s[t] = this.getParam({
              value: s[t],
              defaultValue: e.defaultValue,
              type: e.type
          });
      }
      return s
  }
  static parseList(t, e) {
      let r = t;
      r.startsWith("[") && (r = r.substr(1)), r.endsWith("]") && (r = r.substr(0, r.length - 1));
      const s = r.split(",");
      return e ? s.map((t => e(t))) : s
  }
  static parseArray(t, e) {
      let r;
      try {
          r = JSON.parse(t);
      } catch (t) {
          return []
      }
      return r && r.length ? e ? r.map((t => e(t))) : r : []
  }
  static registerCommand(t, e, r) {
      return "function" == typeof e ? PluginManager.registerCommand(this.getPluginFileName(), t, e) : PluginManager.registerCommand(this.getPluginFileName(), t, (t => {
          const s = new Map;
          for (const e in t) t.hasOwnProperty(e) && s.set(e, t[e]);
          const a = this.loadParamMap(e, s);
          return Object.assign(t, a), r(t)
      }))
  }
}
globalThis.SteamLinkPlugin = e;
class SteamLink extends SteamLinkPlugin {
  static register() {
    this.initialized = false;
    this.initialize('SteamLink');

    super.register({});

    if (typeof require !== 'function') {
      return;
    }

    try {
      this.greenworks = require('./greenworks');
    } catch (e) {
      this.greenworks = false;
      console.error('Greenworks failed to load. Make sure you copied all files from the Steamworks SDK to the right folders;');
      console.log('https://makerdevs.com/plugin/SteamLink-steam');
      console.error(e);
      return;
    }

    this.initialized = this.greenworks.initAPI();
    if (!this.initialized) {
      console.error('Greenworks failed to initialize.');
      return;
    }

    this.steam = this.greenworks.getSteamId();
  }

  static get screenName() {
    if (!this.greenworks) {
      return 'Play Test';
    }

    return (this.steam && this.steam.screenName) || '';
  }

  static get uiLanguage() {
    if (!this.greenworks) {
      return 'english';
    }

    return this.greenworks.getCurrentUILanguage();
  }

  static get gameLanguage() {
    if (!this.greenworks) {
      return 'english';
    }

    return this.greenworks.getCurrentGameLanguage();
  }

  static get achievementCount() {
    if (!this.greenworks) {
      return 0;
    }
    return this.greenworks.getNumberOfAchievements();
  }

  static get running() {
    return this.greenworks && this.greenworks.isSteamRunning();
  }

  static get overlayEnabled() {
    return this.greenworks && this.greenworks.isGameOverlayEnabled();
  }

  static get dlcCount() {
    if (!this.greenworks) {
      return 0;
    }

    return this.greenworks.getDLCCount();
  }

  static get friendCount() {
    if (!this.greenworks) {
      return 0;
    }

    return this.greenworks.getFriendCount(this.greenworks.FriendFlags.Immediate);
  }

  static get cloudEnabled() {
    if (!this.greenworks) {
      return false;
    }

    return this.greenworks.isCloudEnabled();
  }

  static get userCloudEnabled() {
    if (!this.greenworks) {
      return false;
    }

    return this.greenworks.isCloudEnabledForUser();
  }

  static activateAchievement(achievementId) {
    if (!achievementId) {
      console.error('Achievement name not provided.');
      return;
    }

    if (!this.greenworks) {
      console.log(`Activate Achievement ${ achievementId }`);
      return;
    }

    if (!this.running) {
      return;
    }

    this.greenworks.activateAchievement(achievementId, () => {
      console.log(`Achievement activated: ${ achievementId }`);
    }, () => {
      console.log(`Failed to activate achievement: ${ achievementId }`);
    });
  }

  static getAchievement(achievementId) {
    if (!achievementId) {
      console.error('Achievement name not provided.');
      return false;
    }

    if (!this.greenworks) {
      return false;
    }

    if (!this.running) {
      return;
    }

    return this.greenworks.getAchievement(achievementId, () => {
   
    }, () => {
      console.log(`Failed to check achievement: ${ achievementId }`);
    });
  }

  static clearAchievement(achievementId) {
    if (!achievementId) {
      console.error('Achievement name not provided.');
      return;
    }

    if (!this.greenworks) {
      console.log(`Clear achievement ${ achievementId }`);
      return;
    }

    if (!this.running) {
      return;
    }

    this.greenworks.clearAchievement(achievementId, () => {
      console.log(`Successfully cleared achievement: ${ achievementId }`);
    }, () => {
      console.log(`Failed to clear achievement: ${ achievementId }`);
    });
  }

  static activateGameOverlay(option) {
    if (!this.running) {
      return false;
    }

    this.greenworks.activateGameOverlay(option);
  }

  static activateGameOverlayToWebPage(url) {
    if (!this.running) {
      return false;
    }

    this.greenworks.activateGameOverlayToWebPage(url);
  }

  static isDLCInstalled(dlcAppId) {
    if (!this.running) {
      return false;
    }

    return this.greenworks.isDLCInstalled(dlcAppId);
  }

  static installDLC(dlcAppId) {
    if (!this.running) {
      return;
    }

    return this.greenworks.installDLC(dlcAppId);
  }

  static uninstallDLC(dlcAppId) {
    if (!this.running) {
      return;
    }

    return this.greenworks.uninstallDLC(dlcAppId);
  }

  static getStatInt(name) {
    if (!this.running) {
      return 0;
    }

    return this.greenworks.getStatInt(name);
  }

  static getStatFloat(name) {
    if (!this.running) {
      return 0;
    }

    return this.greenworks.getStatFloat(name);
  }

  static setStat(name, value) {
    console.log('Change Stat', name, value);
    if (!this.running) {
      return 0;
    }

    this.greenworks.setStat(name, value);
  }

  static storeStats() {
    console.log('Store Stats');
    if (!this.running) {
      return;
    }

    this.greenworks.storeStats(() => {
      console.log('Store stats: success');
    }, () => {
      console.log('Store stats: failed');
    });
  }

  static isSubscribedApp(appId) {
    if (!this.running) {
      return false;
    }

    return this.greenworks.isSubscribedApp(appId);
  }
}

globalThis.SteamLink = SteamLink;
SteamLink.register();
})();