## Here's some stuff that I've made.

---

### Fire Simulation
[![Fire simulation preview](https://msivonen.github.io/firesim_preview.jpg)<br/>Go to Fire simulation](https://msivonen.github.io/firesim/index.html)

This simulation is based on circle-circle 2d elastic collision simulation. I've added a temperature property to the particles. Hotter particles have less weight (not mass) than colder ones. Hot enough and the weight is negative. At the bottom there's a heater that heats nearby particles. Particles also conduct heat to each other and their heat decays over time.

Play around with the settings and it's guaranteed to go fubar.

Check the blue background, to see how everything works.

I got this idea from a [youtube video](https://www.youtube.com/watch?v=xKEFlg_JMmU) that I saw some time ago, and I decided to make ~~a shameless copy~~ my own version of it...

---

### Quad tree
[![Quad tree preview](https://msivonen.github.io/quadTree_preview.jpg)<br/>Go to Quad tree](https://msivonen.github.io/quadTree/index.html)

Check interactions between points, only if they are inside a specified range.
This is a simple example; check if the circles overlap inside the big circle/rectangle.
Yes, I know my circles have sharp edges. That's to improve performance.

---

### Metaballs
[![Metaballs preview](https://msivonen.github.io/metaballs_preview.jpg)<br/>Go to Metaballs](https://msivonen.github.io/metaballs/index.html)

I thought of adding this to my fire sim, but didn't. It's pretty, so go take a look.

---

### Raycasting
[![Raycasting preview](https://msivonen.github.io/raycasting_preview.jpg)<br/>Go to Raycasting](https://msivonen.github.io/raycasting/index.html)

Simple raycasting demo. wsad to move.

---

### Pi from random angles
[![Random PI preview](https://msivonen.github.io/randompi.jpg)<br/>Go to Random Pi](https://msivonen.github.io/Random_Pi/index.html)

Pi calculated from random angles. Creates random lines with same length and startpoint. Connects the ends to make a polygon to fit inside a circle (red). Makes tangent lines (green) touching the circle at those points. Calculates the intersection points of adjacent tangent lines, and connects those points to make a polygon to fit outside the circle (blue). Calculate the circumference of those blah blah blah, you already guessed it by now.
Mouse click with/out shift and/or control, to add points.
Made with help of AI, because I suck at math and I was lazy.

---


---
See the source code of all of these:
https://github.com/MSivonen/MSivonen.github.io
