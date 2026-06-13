



// Unit test

const summaries = [
calculate("GloomStalker Action Surge", "D20+10", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+7,1D8+1D6+7,2D8+1D6+7)"),
calculate("GloomStalker Action Surge Dis Bless", "D20D1+10+D4", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+7,1D8+1D6+7,2D8+1D6+7)"),
calculate("GloomStalker Action Surge Dis Precision", "D20D1+10+D8", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+7,1D8+1D6+7,2D8+1D6+7)"),
calculate("GloomStalker Action Surge Bless", "D20+10+D4", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+7,1D8+1D6+7,2D8+1D6+7)"),
calculate("GloomStalker Action Surge Advantage", "D20A1+10", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+7,1D8+1D6+7,2D8+1D6+7)"),
calculate("GloomStalker Action Surge Elven Accuracy", "D20A2+10", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+7,1D8+1D6+7,2D8+1D6+7)"),
calculate("GloomStalker Action Surge Elven Accuracy Sharpshooter", "D20A2+10-5", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+17,1D8+1D6+17,2D8+1D6+17)"),
calculate("GloomStalker Action Surge Elven Accuracy Sharpshooter Bless", "D20A2+10-5+1D4", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+17,1D8+1D6+17,2D8+1D6+17)"),
calculate("GloomStalker Action Surge Elven Accuracy Sharpshooter Bless Precision", "D20A2+10-5+1D4+1D8", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D6+17,1D8+1D6+17,2D8+1D6+17)"),
//calculate("術士 4發魔能爆連射", "D20+9", 18, {threshold: 20, multiplier: 2}, "4 1D10+5"),
//calculate("大劍聖騎士至高斬擊 (Fiend)", "D20+8", 18, {threshold: 20, multiplier: 2}, "2D6+2D8+1D8+1D6+15"),
//calculate("5級 雙短劍武僧 連環瘋狂亂打 (Flurry of Blows)", "D20+8", 18, {threshold: 20, multiplier: 2}, "4 (1D6+5)"),
//calculate("11級 雙雷霆戰錘 戰士 雙武器瘋狂連擊 (Two-Weapon Action Surge)", "D20+9", 18, {threshold: 20, multiplier: 2}, "7 (1D6+5)"),
//calculate("9級 狂暴野蠻人 殘虐長矛重擊 (Reckless Brutal Critical Piercer)", "D20+9", 18, {threshold: 19, multiplier: 2}, "2 (1D6+1D6+7) + 1D6"),
//calculate("5級 咒劍邪術師 幽冥大劍魂刃斬 (Eldritch Smite)", "D20+8", 18, {threshold: 19, multiplier: 2}, "2 (2D6+3D8+5)"),
//calculate("5級 吟遊詩人 散兵巨劍華麗揮砍 (Slashing Flourish)", "D20+8", 18, {threshold: 20, multiplier: 2}, "2 (2D6+4) + 1D8"),
//calculate("5級 浪人刺客 毒刃偷襲 (Sneak Attack with Poison)", "D20+8", 18, {threshold: 20, multiplier: 2}, "1 (1D6+3D6+2D6+5)"),
//calculate("11級 聖騎士 破邪斬日光長劍 (Sun Blade vs Undead)", "D20+8+2", 18, {threshold: 20, multiplier: 2}, "2 (1D8+1D8+1D8+7) + 2D8")
];

summaries.forEach(printTestCase);