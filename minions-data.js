/* CHEGG minion roster — paraphrased summaries of each minion's rules,
   plus coordinate sets used to draw the little 7x7 move/attack preview
   grid on each card. Offsets are [row, col] relative to the minion's
   own square (center = [0,0]). Grid is stylized, not pixel-exact. */

const RING8   = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
const LAT1    = [[-1,0],[1,0],[0,-1],[0,1]];
const DIAG1   = [[-1,-1],[-1,1],[1,-1],[1,1]];
const LAT2    = [[-2,0],[2,0],[0,-2],[0,2]];
const FWD3    = [[-1,-1],[-1,0],[-1,1]];
const DIAG3RANGE = [[-1,-1],[-2,-2],[-3,-3],[-1,1],[-2,2],[-3,3],[1,-1],[2,-2],[3,-3],[1,1],[2,2],[3,3]];
const LAT2RANGE  = [[-1,0],[-2,0],[1,0],[2,0],[0,-1],[0,-2],[0,1],[0,2]];
const CROSS3  = [[-1,0],[-2,0],[-3,0],[1,0],[2,0],[3,0],[0,-1],[0,-2],[0,-3],[0,1],[0,2],[0,3]];
const DIAMOND = [...RING8, ...LAT2];

const MINIONS = [
  {
    id:"villager", name:"Villager", cost:0, costLabel:"Free", tier:"king",
    img:"src/mob-villager.png",
    move:"8 surrounding squares — attacking moves it onto the target square.",
    attack:"Same 8 squares as its move.",
    ability:"This is your king. Lose it and you lose the match. Unlike every other minion, moving the Villager always costs 1 mana — even a free move — so dashing it costs 2 mana total.",
    movePattern:RING8, attackPattern:RING8
  },
  {
    id:"zombie", name:"Zombie", cost:1, tier:"offense", img:"src/mob-zombie.png",
    move:"Forward only — one of the three squares directly ahead.",
    attack:"The 4 lateral squares immediately around it.",
    ability:"A cheap, simple frontline unit. No special ability.",
    movePattern:FWD3, attackPattern:LAT1
  },
  {
    id:"creeper", name:"Creeper", cost:1, tier:"offense", img:"src/mob-creeper.png",
    move:"Any of the 8 surrounding squares.",
    attack:"One-time detonation — destroys every minion in the 8 surrounding squares, including itself.",
    ability:"Friendly fire applies. A high-risk, high-reward finisher — place it carefully.",
    movePattern:RING8, attackPattern:RING8
  },
  {
    id:"pig", name:"Pig", cost:1, tier:"support", img:"src/mob-pig.png",
    move:"Any of the 8 surrounding squares.",
    attack:"None — the Pig can't attack.",
    ability:"Draw 1 card the moment it's spawned, and draw 1 more when it dies. Pure card advantage.",
    movePattern:RING8, attackPattern:[]
  },
  {
    id:"rabbit", name:"Rabbit", cost:2, tier:"support", img:"src/mob-rabbit.png",
    move:"Hops 2 squares in any lateral direction.",
    attack:"None — the Rabbit can't attack.",
    ability:"If its hop jumps over any minion — friend or foe — its owner draws 1 card.",
    movePattern:LAT2, attackPattern:[]
  },
  {
    id:"pufferfish", name:"Puffer-Fish", cost:2, tier:"offense", img:"src/mob-pufferfish.png",
    move:"1 square, laterally only.",
    attack:"All 4 diagonal squares around it, simultaneously.",
    ability:"A cheap area-denial piece. Watch out for friendly fire on the diagonal burst.",
    movePattern:LAT1, attackPattern:DIAG1
  },
  {
    id:"irongolem", name:"Iron Golem", cost:2, tier:"offense", img:"src/mob-irongolem.png",
    move:"Any of the 8 surrounding squares.",
    attack:"A sweeping strike across 3 tiles in one chosen lateral direction.",
    ability:"Low cost for a wide, line-clearing swing.",
    movePattern:RING8, attackPattern:FWD3
  },
  {
    id:"frog", name:"Frog", cost:2, tier:"utility", img:"src/mob-frog.png",
    move:"Any of the 8 surrounding squares.",
    attack:"None — the Frog can't destroy enemies directly.",
    ability:"Special (1 mana): pull any minion, friend or foe, 2 squares closer along a lateral line, from any range.",
    movePattern:RING8, attackPattern:[], copyLimit:"Deck limit: max 2 per deck"
  },
  {
    id:"skeleton", name:"Skeleton", cost:3, tier:"offense", img:"src/mob-skeleton.png",
    move:"1 square, laterally only.",
    attack:"Diagonal sniping, up to 3 squares away.",
    ability:"Great reach for the cost, but boxed into lateral movement to get there.",
    movePattern:LAT1, attackPattern:DIAG3RANGE
  },
  {
    id:"blaze", name:"Blaze", cost:3, tier:"offense", img:"src/mob-blaze.png",
    move:"1 square, diagonally only.",
    attack:"Lateral fire, up to 2 squares away.",
    ability:"The mirror image of the Skeleton — diagonal legs, lateral aim.",
    movePattern:DIAG1, attackPattern:LAT2RANGE
  },
  {
    id:"phantom", name:"Phantom", cost:3, tier:"offense", img:"src/mob-phantom.png",
    move:"Dark tiles only — it can be spawned, moved, or attack only on the board's dark squares.",
    attack:"Any dark tile it could otherwise move to (standard 1 mana attack cost).",
    ability:"Highly mobile within its restriction, but boxed out of light tiles entirely.",
    movePattern:RING8, attackPattern:RING8
  },
  {
    id:"enderman", name:"Enderman", cost:4, tier:"utility", img:"src/mob-enderman.png",
    move:"Cannot move under its own power.",
    attack:"Any of the 8 surrounding squares.",
    ability:"Special (1 mana), \u2018Teleport\u2019: swap places with any minion — friend or foe, except the Villager — along a lateral line at any range. Can't teleport and attack the same turn.",
    movePattern:[], attackPattern:RING8
  },
  {
    id:"slime", name:"Slime", cost:4, tier:"offense", img:"src/mob-slime.png",
    move:"Jumps 2 squares laterally, leaping clean over anything in its path.",
    attack:"Lands on and hits whatever occupies its destination square — costs 1 mana if that square is occupied (can't combine with a dash).",
    ability:"A mobile bruiser that ignores blockers entirely.",
    movePattern:LAT2, attackPattern:LAT2
  },
  {
    id:"shulkerbox", name:"Shulker-Box", cost:4, tier:"defense", img:"src/mob-shulkerbox.png",
    move:"Can't move freely — instead it relocates to wherever its attack lands.",
    attack:"Long-range lateral and vertical fire, blocked by anything standing in the projectile's path.",
    ability:"A stationary turret that plants itself deeper into the board with every successful hit.",
    movePattern:[], attackPattern:CROSS3
  },
  {
    id:"parrot", name:"Parrot", cost:5, tier:"utility", img:"src/mob-parrot.png",
    move:"A wide, diamond-shaped range across the board.",
    attack:"None of its own — instead it copies the attack pattern of any minion laterally adjacent to it, friend or foe.",
    ability:"Turns your best neighboring attacker into a second copy of itself.",
    movePattern:DIAMOND, attackPattern:[]
  },
  {
    id:"cat", name:"Cat", cost:5, tier:"support", img:"src/mob-cat.png",
    move:"Cannot move or attack — not even with a dash.",
    attack:"None.",
    ability:"Passively grants its owner +1 max mana every turn. Multiple Cats stack.",
    movePattern:[], attackPattern:[]
  },
  {
    id:"sniffer", name:"Sniffer", cost:5, tier:"utility", img:"src/mob-sniffer.png",
    move:"Any of the 8 surrounding squares.",
    attack:"None — the Sniffer can't attack.",
    ability:"On spawn, draw 2 cards from your opponent's deck instead of your own. On death, discard 2 minions from your hand if able.",
    movePattern:RING8, attackPattern:[]
  },
  {
    id:"wither", name:"Wither", cost:6, tier:"offense", img:"src/mob-wither.png",
    move:"Any of the 8 surrounding squares.",
    attack:"Costs 2 mana instead of the usual 1 — fires a lateral projectile 3 squares out, splashing the tiles beside its path.",
    ability:"On spawn, immediately destroys everything in the 8 surrounding squares — friend or foe. The single most expensive, most explosive minion in the deck.",
    movePattern:RING8, attackPattern:CROSS3, copyLimit:"Deck limit: max 1 per deck"
  }
];

if (typeof module !== "undefined") module.exports = { MINIONS };
