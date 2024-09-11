<script setup>
import Jumbotron from '../components/Jumbotron.vue'
</script>

<template>
  <Jumbotron header="About" />
  <p>This application allows you to analyze and visualize the typing patterns
    you create when you use different keyboard layouts, such as the
    <a href="https://en.wikipedia.org/wiki/QWERTY">QWERTY</a>,
    <a href="http://www.theworldofstuff.com/dvorak/">Dvorak</a>, and
    <a href="http://colemak.com/">Colemak</a> layouts.</p>
  <hr/>
  <p>This version of the app was
    <a href="https://github.com/stevep99/keyboard-layout-analyzer">forked by SteveP</a>
    from the original
    <a href="http://patorjk.com/keyboard-layout-analyzer/">Keyboard Layout Analyzer</a>
    by PAT or JK.</p>
  <p>A number of changes are made in this version with the aim of making the
    analyzer more useful and accurate, particularly in regard to the scoring
    calculation. The changes are detailed below, so you can evaluate the merits
    of these changes yourself. A huge thanks to Patrick (PAT or JK) for
    releasing his source code, making this forked version possible!</p>

  <h2>Scoring Algorithm</h2>

  <p>I have studied the source code in the original app to understand how the
    analyzer and scoring systems work. The following is my best interpretation
    of its methodology:</p>
  <p>Layouts are scored according to four weighted elements:</p>
  <ul>
    <li>distance fingers moved (33%)</li>
    <li>distribution of work among fingers (33%)</li>
    <li>same-finger bigrams (17%)</li>
    <li>hand alternation (17%)</li>
  </ul>
  <p>I now present a critique of each of these elements, and where relevant,
    describe the changes I have made in this version of the app:</p>
  
  <h3>Element 1: Distance calculation</h3>
  <p>The distance calculation works by simulating the typing of the input text
    and measuring the distance between successive keys. These distances are
    summed up, and a score is calculated based on the average distance moved
    across all key presses. This method works reasonably well but is overly
    simplistic. I have identified three flaws with it:</p>
  <p><strong>Flaw 1</strong>: no consideration is taken into account of the
    type of movement.</p>
  <img src="@/assets/kb-j-arrows.png" width="142" height="150" />
  <p>Consider if you start with your right hand in the home position (using
    Qwerty), and type JH, JU, and JM. It is more difficult to move from J to H
    than it is from J to U or J to H. This is because the index finger can
    easily stretch outward to the U or curl inward to the M. However, to type
    the H, the finger has to splay outwards, or the whole hand has to move.
    Consequently, more effort is required for this type of lateral motion. This
    phenomenon is well-documented in the justification behind both the Workman
    and Colemak-DH layouts.</p>
  <p>If you simply measure distance between J and its nearby keys however, then
    due to the keyboard stagger, JH is a shorter distance than JU or JM. In
    such cases, the default algorithm rewards motions involving more difficult
    (but slightly nearer) keys. What would be desired to fix this problem, is
    to replace the pure distance measure with a distance penalty, in which
    horizontal movements are given a higher penalty than vertical ones for the
    same distance moved.</p>
  <p>Also, the raw distance measurement does not take into account that some
    fingers are stronger than others, especially for motions that involve
    simple curling inward/outward that don’t require the whole hand to move.</p>
  <p><strong>Flaw 2</strong>: Even with a directional penalty added, notice that
    the distance between JM and JN is the same. In reality though, again because
    of the stagger on standard boards, the JM movement is easier. To address
    this issue, we need to consider that the hands approach the keyboard at an
    angle. On the right-hand side of the keyboard, the arms approach the
    keyboard in the same direction as the stagger, but on the left-side, the
    stagger is effectively the wrong way around. A more accurate algorithm
    should aim to take this effect into account.</p>
  <p><strong>Flaw 3</strong>: The distance penalty should not linear, but
    rather logarithmic, as observed by
    <a href="https://en.wikipedia.org/wiki/Fitts’s_law">Fitts’s Law</a>.
    Fitts’s Law is a predictive model of human movement which can be used to
    estimate the time or effort it takes to perform a variety of actions, based
    on the distance and size of the target.</p>
  <p><strong><u>Fixes:</u></strong> This version of the app applies fixes to
    the algorithm to address all these flaws.</p>
  <ul>
    <li>The simple distance calculation is replaced by a “distance penalty”.</li>
    <li>The penalty is finger-dependent for actions that require a simple
      inward/outward curling of the finger, for example to reach upward with
      the middle finger from <em>K to I</em> (in Qwerty).</li>
    <li>The penalty is larger for horizontal movements, recognising that this
      component requires the whole hand to move or for fingers to splay out
      awkwardly, for example the motion of the index finger from <em>F to G</em>
      (in Qwerty).</li>
    <li>The coordinate system for movement vectors is rotated to align with the
      angle of approach of the hands. This currently set to a 10° angle, and is
      applied clockwise for the left hand, anticlockwise for the right hand.</li>
    <li>Fitts’s Law is incorporated in this version of the analyzer so both
      horizontal and vertical components are appropriately scaled.</li>
  </ul>
  <figure>
    <table class="left-first">
      <thead>
        <tr><th>Finger</th><th>Effort</th></tr>
      </thead>
      <tbody>
        <tr><td>index¹</td><td>1.0</td></tr>
        <tr><td>middle¹</td><td>1.1</td></tr>
        <tr><td>ring¹</td><td>1.3</td></tr>
        <tr><td>pinky¹</td><td>1.6</td></tr>
        <tr><td>horizontal motions²</td><td>2.0</td></tr>
      </tbody>
    </table>
    <figcaption>
      ¹ Relative effort for vertical finger curling motion.<br/>
      ² Relative effort for whole hand horizontal motion.
    </figcaption>
  </figure>
  <p>With these fixes, this element of the scoring system is now more highly
    prioritised, increasing from 33% to 50%.</p>
          
  <h3>Element 2: Finger distribution</h3>
  <p>The original algorithm defines a score value for each finger as follows:<br/>
    PINKY: 0.5<br/>
    RING: 1.0<br/>
    MIDDLE: 4.0<br/>
    INDEX: 2.0<br/>
    THUMB: 0.5<br/>
  </p>
  <p>Then, it calculates what proportion of typing is done on each finger,
    subject to a maximum of 20% per finger. The final score is proportional to
    this sum over all fingers: (finger-score) × (finger-frequency)</p>
  <p>The consequence of this algorithm is that middle finger is heavily
    favoured, even compared to the index finger. Layouts deemed high scoring
    would be those that assign 20% of the work to favoured fingers—middle
    especially followed by index—but with very little or none on pinkies and
    thumbs. I think this method may be flawed in that it too heavily weights
    the middle finger, and encourages loading of favoured fingers upto the
    seemingly arbitrary 20%. However, I accept that this element of the
    algorithm may in fact be counter-balanced by the distance algorithm, which
    would reward all home key usage (including pinkies and thumbs where
    defined), by assigning a movement distance of zero in those cases.</p>
  <p><strong><u>Fix:</u></strong> A simpler effort calculation is employed
    based on the finger weightings in the table above, representing the
    relative strength of each finger. Additionally, a small finger-imbalance
    factor has been introduced to this element, recognising that a good layout
    should assign rougly equal work symmetrically to fingers of both left and
    right hands. That is, if the left-index finger performs 15% of key presses,
    the right-index finger should do similarly.</p>
  <p>I have reduced the weighting of this element of the scoring from 33% to 20%.</p>
  
  <h3>Element 3: Same-finger bigrams</h3>
  <p>The original app simply counts what proportion of each key presses and
    done with the same finger as the previous one. It then calculates a
    percentage score based on the same-finger ratio in the range 0 to 10%. In
    other worlds, a layout with a 5% same-finger ratio, would score 50% in this
    element.</p>
  <p><strong><u>Fix:</u></strong> No fix needed. The weighting of this element
    of the calculation is increased from 17% to 30%.</p>

  <h3>Element 4: Hand alternation</h3>
  <p>Similar to the same-finger count, it simply counts which proportion of key
    presses were with same hand as the previous one. This favours heavily
    alternating layouts. However, in my view this flawed, as no account is
    taken that some same-hand combinations are actually some of the most
    comfortable bigrams of all: the Colemak ST and NE, or the Dvorak TH, for
    examples. Perhaps this element could be improved, for example to detect
    longer same-hand sequences which would be detrimental. In it’s current form
    though, I don’t see much value in this element.</p>
  <p><strong><u>Fix:</u></strong> Removed from the scoring calculation.</p>

  <h2>Other changes made from the original repo</h2>

  <ul>
    <li>There were a lot of seemingly random, unrecognised layouts. I removed
      most of them. The list now only contains layouts that are at least
      semi-well-known in the community.</li>
    <li>The Colemak-DH layout variants have been added.</li>
    <li>Number of layouts in the comparison changed from 5 to 6.</li>
    <li>Removed the generated “Personalized Layout” as I considered it to not
      really have any value.</li>
    <li>Added support for additional keyboard types.</li>
    <li>Various other input texts have been added, these were obtained from
      <a href="https://bitbucket.org/Shenafu/keyboard-layout-analyzer/src/master/">shenafu’s fork</a>
      of the same app.</li>
    <li>Disabled the API functionality (e.g. link to results) as github hosting
      does not support php.</li>
  </ul>

  <h2>Bugs</h2>

  <p>Please report bugs at the
    <a href="https://github.com/stevep99/keyboard-layout-analyzer/issues">issue tracker</a>
    on github.</p>
</template>

<style scoped>
img {
  float: left;
  margin-left: 0;
}
</style>
