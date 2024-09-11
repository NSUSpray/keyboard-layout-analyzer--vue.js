/**
 * Key maps (physical key locations) generated by Keyboard Layout Editor
 * http://www.keyboard-layout-editor.com/ (“Raw data” tab) with keys labeled as
 * 
 *     KLA key index (two decimal digits).
 *    /
 *   dd .. cc -- One or two keystroke point coordinates of the form
 *   .. .. ..    “x[ y][;x2[ y2]]”, where x and optional y are components of
 *   xx .. ..    the first coordinate and the optional components of the second
 *    \          coordinate. Default value is the center of the key.
 *     Scan code (maybe "E0 " + two hexadecimal digits).
 */

const kleKeyMaps = {
  standard: [
    ["00\n29","01\n02","02\n03","03\n04","04\n05","05\n06","06\n07","07\n08",
      "08\n09","09\n0A","10\n0B","11\n0C","12\n0D",{w:2},"13\n0E\n0"],
    [{w:1.5},"14\n0F\n0.5","15\n10","16\n11","17\n12","18\n13","19\n14",
      "20\n15","21\n16","22\n17","23\n18","24\n19","25\n1A","26\n1B",{w:1.5},
      "27\n2B\n0"],
    [{w:1.5,w2:1.75,l:true},"28\n3A\n0.5",{x:0.25},"29\n1E","30\n1F","31\n20",
      "32\n21","33\n22","34\n23","35\n24","36\n25","37\n26","38\n27","39\n28",
      {w:2.25},"40\n1C\n0"],
    [{w:2.25},"41\n2A\n1.25","42\n2C","43\n2D","44\n2E","45\n2F","46\n30",
      "47\n31","48\n32","49\n33","50\n34","51\n35",{w:2.75},"52\n36\n0"],
    [{w:1.25},"53\n1D",{w:1.25},"54\nE0 5B",{w:1.25},"55\n38",
      {w:6.25},"56\n39\n1;4",{w:1.25},"57\nE0 38",{w:1.25},"58\nE0 5C",
      {w:1.25},"59\nE0 5D",{w:1.25},"60\nE0 1D"]
  ],
  european: [
    ["00\n29","01\n02","02\n03","03\n04","04\n05","05\n06","06\n07","07\n08",
      "08\n09","09\n0A","10\n0B","11\n0C","12\n0D",{w:2},"13\n0E\n0"],
    [{w:1.5},"14\n0F\n0.5","15\n10","16\n11","17\n12","18\n13","19\n14",
      "20\n15","21\n16","22\n17","23\n18","24\n19","25\n1A","26\n1B",
      {x:0.25,w:1.25,h:2,w2:1.5,h2:1,x2:-0.25},"27\n1C\n0 0"],
    [{w:1.5,w2:1.75,l:true},"28\n3A\n0.5",{x:0.25},"29\n1E","30\n1F","31\n20",
      "32\n21","33\n22","34\n23","35\n24","36\n25","37\n26","38\n27","39\n28",
      "40\n2B"],
    [{w:1.25},"41\n2A","42\n56","43\n2C","44\n2D","45\n2E","46\n2F","47\n30",
      "48\n31","49\n32","50\n33","51\n34","52\n35",{w:2.75},"53\n36\n0"],
    [{w:1.25},"54\n1D",{w:1.25},"55\nE0 5B",{w:1.25},"56\n38",
      {w:6.25},"57\n39\n1;4",{w:1.25},"58\nE0 38",{w:1.25},"59\nE0 5C",
      {w:1.25},"60\nE0 5D",{w:1.25},"61\nE0 1D"]
  ],
  european_ss: [
    ["00\n29","01\n02","02\n03","03\n04","04\n05","05\n06","06\n07","07\n08",
      "08\n09","09\n0A","10\n0B","11\n0C","12\n0D",{w:2},"13\n\n0"],
    [{w:1.5},"14\n0F\n0.5","15\n10","16\n11","17\n12","18\n13","19\n14",
      "20\n15","21\n16","22\n17","23\n18","24\n19","25\n1A","26\n1B",
      {x:0.25,w:1.25,h:2,w2:1.5,h2:1,x2:-0.25},"27\n1C\n0 0"],
    [{w:1.5,w2:1.75,l:true},"28\n3A\n0.5",{x:0.25},"29\n1E","30\n1F","31\n20",
      "32\n21","33\n22","34\n23","35\n24","36\n25","37\n26","38\n27","39\n28",
      "40\n2B"],
    [{w:1.25},"41\n2A","42\n56","43\n2C","44\n2D","45\n2E","46\n2F","47\n30",
      "48\n31","49\n32","50\n33","51\n34","52\n35",{w:2.75},"53\n36\n0"],
    [{w:1.25},"54\n1D",{w:1.25},"55\nE0 5B",{w:1.25},"56\n38",
      {w:3},"57\n0E\n1",{w:3.25},"58\n39\n1",{w:1.25},"59\nE0 38",
      {w:1.25},"60\nE0 5C",{w:1.25},"61\nE0 5D",{w:1.25},"62\nE0 1D"]
  ],
  ergodox: [
    [{x:3.5},"03\n04",{x:10.5},"10\n09"],
    [{y:-0.875,x:2.5},"02\n03",{x:1},"04\n05",{x:8.5},"09\n08",{x:1},"11\n0A"],
    [{y:-0.875,x:5.5},"05\n06","06\n01",{x:4.5},"07","08\n07"],
    [{y:-0.875,w:1.5},"00\n0D\n0.5","01\n02",{x:14.5},"12\n0B",{w:1.5},"13\n0C\n0"],
    [{y:-0.375,x:3.5},"17\n12",{x:10.5},"24\n17"],
    [{y:-0.875,x:2.5},"16\n11",{x:1},"18\n13",{x:8.5},"23\n16",{x:1},"25\n18"],
    [{y:-0.875,x:5.5},"19\n14",{h:1.5},"20\n\n0 0.5",{x:4.5,h:1.5},"21\n\n0 0.5","22\n15"],
    [{y:-0.875,w:1.5},"14\n0F\n0.5","15\n10",{x:14.5},"26\n19",{w:1.5},"27\n2B\n0"],
    [{y:-0.375,x:3.5},"31\n20",{x:10.5},"36\n25"],
    [{y:-0.875,x:2.5},"30\n1F",{x:1},"32\n21",{x:8.5},"35\n24",{x:1},"37\n26"],
    [{y:-0.875,x:5.5},"33\n22",{x:6.5},"34\n23"],
    [{y:-0.875,w:1.5},"28\n3A\n0.5","29\n1E",{x:14.5},"38\n27",{w:1.5},"39\n28\n0"],
    [{y:-0.625,x:6.5,h:1.5},"46\n\n0 0",{x:4.5,h:1.5},"47\nE0 38\n0 0"],
    [{y:-0.75,x:3.5},"43\n2E",{x:10.5},"50\n33"],
    [{y:-0.875,x:2.5},"42\n2D",{x:1},"44\n2F",{x:8.5},"49\n32",{x:1},"51\n34"],
    [{y:-0.875,x:5.5},"45\n30",{x:6.5},"48\n31"],
    [{y:-0.875,w:1.5},"40\n2A\n0.5","41\n2C",{x:14.5},"52\n35",{w:1.5},"53\n36\n0"],
    [{y:-0.375,x:3.5},"57\nE0 4B",{x:10.5},"60\nE0 50"],
    [{y:-0.875,x:2.5},"56\n56",{x:1},"58\nE0 4D",{x:8.5},"59\nE0 48",{x:1},"61\n1A"],
    [{y:-0.75,x:0.5},"54","55\n29",{x:14.5},"62\n1B","63\nE0 5D"],
    [{r:25,rx:6.5,ry:4.25,y:-1,x:1},"64\n1D","65\n38"],
    [{h:2},"66\n0E",{h:2},"67\nE0 53","68\nE0 47"],
    [{x:2},"69\nE0 4F"],
    [{r:-25,rx:13,y:-1,x:-3},"70\nE0 5B","71\nE0 1D"],
    [{x:-3},"72\nE0 49",{h:2},"74\n1C",{h:2},"75\n39"],
    [{x:-3},"73\nE0 51"]
  ],
  matrix: [
    ["00\n29","01\n02","02\n03","03\n04","04\n05","05\n06",
      "06\n07","07\n08","08\n09","09\n0A","10\n0B","11\n0C"],
    ["12\n0F","13\n10","14\n11","15\n12","16\n13","17\n14",
      "18\n15","19\n16","20\n17","21\n18","22\n19","23\n0D"],
    ["24\n3A","25\n1E","26\n1F","27\n20","28\n21","29\n22",
      "30\n23","31\n24","32\n25","33\n26","34\n27","35\n28"],
    ["36\n2A","37\n2C","38\n2D","39\n2E","40\n2F","41\n30",
      "42\n31","43\n32","44\n33","45\n34","46\n35","47\n36"],
    ["48\n1D","49\nE0 5B","50\n38","51\n2B","52\n0E","53\n1A",
      "54\n1B","55\n39","56\n1C","57\nE0 38","58\nE0 5D","59\nE0 1D"]
  ]
}

export default kleKeyMaps
