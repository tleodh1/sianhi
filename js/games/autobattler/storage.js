(function (global) {
  "use strict";
  const VERSION = 1;
  function fresh() {
    return { version: VERSION, bestStage: 1, games: 0, wins: 0, collection: {}, tutorialSeen: false, activeRun: null };
  }
  function get() {
    const root = global.state || {};
    root.records = root.records && typeof root.records === "object" ? root.records : {};
    const raw = root.records.autoBattler;
    const record = raw && typeof raw === "object" ? { ...fresh(), ...raw } : fresh();
    root.records.autoBattler = record;
    return record;
  }
  function saveRecord(record) {
    if (!global.state.records) global.state.records = {};
    global.state.records.autoBattler = record;
    if (typeof global.save === "function") global.save();
  }
  function createRun() {
    return {
      runId: Date.now(), stageIndex: 0, playerHp: 30, gold: 12, level: 2, xp: 0,
      board: [], bench: [], inventory: ["power", "gear", "armor", "crystal"],
      equipment: [], shop: [], pool: Object.fromEntries(global.AutoBattlerData.characters.map((c) => [c.id, 18 - c.grade * 2])),
      streak: 0, phase: "PREP", selectedUnit: null, selectedItems: [], result: null,
    };
  }
  global.AutoBattlerStorage = { get, saveRecord, createRun };
})(window);
