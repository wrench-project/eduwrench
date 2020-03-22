---
layout: page
title: 'A.1. Single-core Computing'
order: 110
usemathjax: true
submodule: 'pdcc'
excerpt: 'This module provides basic knowledge about sequential computing (i.e., running a program on a single core).'
---

The goal of this module is to provide you with basic knowledge about
sequential computing (i.e., running a program on a single core).  There
is a lot of complexity under the cover, which belongs in Computer Architecture 
and Operating Systems textbooks. We take a very high-level approach,
with a main focus on performance.

Go through the tabs below in sequence...

<div class="ui pointing secondary menu">
  <a class="item " data-tab="first">Work and Speed</a>
  <a class="item " data-tab="second">Time Sharing</a>
  <a class="item " data-tab="third">Memory</a>
  <a class="item " data-tab="fourth">IO</a>
  <a class="item " data-tab="fifth">Capstone Exercise</a>
</div>

<div markdown="1" class="ui tab segment active" data-tab="first" >
  {% include_relative include_single_core_computing/work_and_speed.md %}
</div>
<div markdown="1" class="ui tab segment" data-tab="second">
  {% include_relative include_single_core_computing/timesharing.md %}
</div>
<div markdown="1" class="ui tab segment" data-tab="third">
  {% include_relative include_single_core_computing/memory.md %}
</div>

<div markdown="1" class="ui tab segment" data-tab="fourth">
  {% include_relative include_single_core_computing/io.md %}
</div>

<div markdown="1" class="ui tab segment" data-tab="fifth">
  {% include_relative include_single_core_computing/capstone.md %}
</div>
