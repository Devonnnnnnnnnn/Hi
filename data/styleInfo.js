const styleInfo = {
  Hinoto: "Starter style, common rarity and all of the stats are at 50%.",
  Tonoko:
    "Common spiker style, block; bump; jump and serve are on 50%, dive is on 40%, set and speed are on 30% and spike is on 70%.",
  Haibo:
    "Common blocker style, serve is on 10%, spike is on 20%, speed is on 30%, dive is on 40%, bump and set are on 50%, block is on 60% and jump is on 70%.",
  Kito: "Common libero style, block and jump are on 40%, serve is on 25%, set is on 20%, spike is on 30%, bump and speed are on 70% and dive is on 75%.",
  Saguwuru:
    "Common spiker/setter style, speed and bump are on 40%, block; jump and serve are on 50%, dive is on 55%, spike is on 70% and set is on 75%.",
  Yamegushi:
    "Common server style, set is on 30%, spike is on 40%, block; speed and dive are on 50%, bump is on 70%, jump and serve are on 75%.",
  Nichonayo:
    "Rare libero style, block is on 50%, bump is on 100%, dive is on 100%, jump is on 50%, serve is on 10%, set is on 30%, speed is on 70%, spike is on 25%.",
  Tsuzichiwa:
    "Rare blocker style, bump and speed are on 40%, dive is on 45%, serve and spike are on 50%, set is on 70%, blocker is on 75% and jump is on 100%.",
  Ojiri:
    "Rare server style, spike and set are on 40%, dive is on 45%, block and speed are on 50%, bump and serve are on 70% and jump is on 75%.",
  Iwaezeni:
    "Rare spiker style, bump and speed are at 40%, dive is at 45%, block; serve and set are at 50%, spike is at 70% and jump is at 75%.",
  Uchishima:
    "Legendary spiker style, bump and set are on 40%, block; dive; speed and set are on 50%, jump is on 70% and spike is on 100%.",
  Kosumi:
    "Legendary libero/setter style, block and speed are 50%, bump is on 65%, dive is on 80%, jump and set are on 70%, serve is on 10% and spike is on 40%.",
  Sagafura:
    "Legendary libero/setter, block and jump are on 50%, bump is on 70%, dive is on 80%, serve is on 10%, set is on 75%, speed is on 100%, spike is on 40%.",
  Azamena:
    "Legendary spiker style, set is at 20%, block is at 30%, speed is at 35%, dive is at 45%, bump is at 50%, jump is at 70%, serve and spike are at 90%.",
  Yabu: "Legendary Libero/Blocker style, serve is at 10%, spike is at 30%, set is at 50%, block is at 70%, bump and dive are on 85% and jump and speed are on 100%.",
  Kuzee:
    "Legendary Spiker/Blocker style, speed is at 10%, set is at 35%, dive is at 40%, block and bump are on 70%, serve and spike are on 80% and jump is on 100%.",
  Yomomute:
    "Legendary spiker/libero style, set is on 35%, block; speed and jump are on 50%, serve is on 25%, spike is on 70%, bump is on 75% and dive is on 80%.",
  Kagayomo:
    "Godly setter/blocker style, block; serve and jump are on 80%, bump is on 45%, dive and speed are on 70%, spike is on 50% and set is on 100%.",
  Butoku:
    "Godly spiker/ blocker style, set is on 30%, speed is on 35%, dive is on 45%, bump is on 50%, block is on 75%, serve is on 80% and spike with jump are on 100%.",
  Oigawa:
    "Godly setter/ server style, block and set are on 90%, bump and spike are on 40%, dive and speed are on 50% and jump with serve are on 100%.",
  Hirakumi:
    "Godly blocker style, speed is on 15%, bump is on 40%, dive is on 45%, set and spike are on 50%, serve is on 90% and jump with block are 100%.",
  Sanu: `Secret spiker style, block; bump and dive are on 50%, serve is on 30%, set and speed are on 40%, jump and spike are on 100% and his special ability is super tilt which is on 100%+.
Sanu's Secret Special is Super Tilt.

Normally, tilting allows for more reach sideways (approximately 1.5 more ball widths on each side), but does not change direction. However, Sanu's spikes change by about a few degrees from the direction he's facing whenever spiking with tilt.`,
  "Timeskip Hinoto": `Secret spiker style, set is on 30%, bump is on 40%, block and dive are on 50%, speed is on 70%, serve is on 90%, jump is on 100% and spike is on 85%-110%. Timeskip Hinoto's Secret Special is Super Spike.

At the bottom of the screen, there is a meter. This is the Spike Gauge. It can gradually be filled by moving around, but if you stop moving, then it'll immediately become empty. It will also stop filling (but not empty itself) when you jump. The more filled the Spike Gauge, the more powerful your spike will be. If you manage to fill the entire gauge before spiking, you will land a Super Spike. This Super Spike releases purple bolts of lightning and will be more powerful than a style with a max spike stat.`,
  "Timeskip Kagayomo": `Secret setter style, bump is on 35%, spike and block are on 50%, dive is on 60%, speed is on 85%, jump is on 90% and serve with set are on 100%. Timeskip Kagayomo's Secret Special is Super Set.

When you do a directional set, the ball will instantaneously float a fixed distance in that direction before stopping and falling straight down. This distance can be altered with Advanced Controls. Timeskip Kagayomo's Super Set would float a bit upwards and last slightly longer in the air before falling.`,
  "The Twins (Osuma)": `Secret spiker/ blocker, serve is on 10%, speed it on 20%, dive is on 35%, bump is on 40%, set is on 50%, block is on 85%, jump and spike are on 100%. Super Switch: You can switch between 2 different styles, Atasumi and Osuma, in-game. This ability has a cooldown of 5 seconds.`,
  "The Twins (Atasumi)": `Secret setter style, block is on 20%, spike is on 35%, bump is on 50%, jump is on 60%, dive is on 70%, speed is on 85% and serve and set are on 100%. Super Switch: You can switch between 2 different styles, Atasumi and Osuma, in-game. This ability has a cooldown of 5 seconds.

Super Float: When serving with Atasumi, you can back-tilt in order to perform a "float serve". Upon reaching the opponent's side, the ball will rapidly decelerate and curve, making for an unpredictable, erratic serve. You can sort of control where it will float by doing left/right back-tilts, where it will then curve down with a slight inclination towards that direction.`,
  Kimiro: `Secret libero style, block is on 20%, spike is on 30%, jump and serve are on 75%, bump; set and speed are on 100% and dive is on 100%+. Kimiro's Secret Special is Super Dive.

Kimiro can charge up a dive. This dive can cover great distances, such as the entire court, quickly. He also has a 50% increased dive hitbox.`,
  "Timeskip Oigawa": `Secret setter style, block is on 20%, bump is on 30%, dive is on 40%, spike is on 60%, speed is on 80% and jump; serve and set are on 100%. Timeskip Oigawa's Secret Special is Super Serve.

Super Serve: When setting the power for a serve, the power meter will be slightly extended, and there will be a small, shiny section at the end of it. If you manage to time it right and hit the marker in the "rainbow" section, the subsequent serve will be enhanced into a Super Serve. It isn't any stronger than a max power serve (at least not noticeably), but it has a couple of special effects. First, the person who receives this Super Serve will be knocked back a small distance and stunned on the ground for approximately 2 seconds. Then, the ball will go in the direction based on the position of the receiver. For example, if the ball is hit to the left of the receiver, it'll fly left. And vice versa for the right, and the same for all directions. When receiving, the ball will fly in a high arc, rising up and falling down at a high speed.`,
  Taichou: `Secret setter style, block is on 20%, bump is on 35%, spike is on 40%, dive is on 60%, serve is on 80%, speed is on 90% and jump with set are on 100%. 

  Taichou's Secret Special is Super Enhance.

Whenever Taichou does a set of any kind, it will enhance the power of the next spike that interacts with the ball. There are 3 levels of boosts.

Base/ground sets will boost spike power a little, giving off a faint, wispy trail of air.
Neutral (no tilt) OR low-power side sets (under 50% power) will boost spike power a bit more, exuding a fiery orange trail.
Neutral jumpsets will give off the faint trail of air instead of the orange one, but the buff is there.
Sideways, max-power side sets (at least 50% power) will boost spike power the most, flourishing a magical, purple trail.
These boosts can also stack with multiple Taichou users, resulting in a large boost for the spiker if two fast jumpsets are hit in succession.`,
};

module.exports = styleInfo;