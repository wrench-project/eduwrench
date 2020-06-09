---
layout: page
title: 'A.1. Single-core Computing'
order: 110
usemathjax: true
submodule: 'pdcc'
---

The goal of this module is to provide you with basic knowledge about sequential computing (i.e., running a program on a single core). 

There is a lot of complexity under the cover, which belongs in Computer Architecture 
and Operating Systems courses/textbooks. Instead, we take a high-level approach,
with a focus on performance.

Go through the tabs below in sequence...

<div class="ui pointing secondary menu">
  <a class="item" data-tab="work-and-speed">Work and Speed</a>
  <a class="item" data-tab="time-sharing">Time Sharing</a>
  <a class="item" data-tab="memory">Memory</a>
  <a class="item" data-tab="io">IO</a>
  <a class="item" data-tab="capstone">Capstone Exercise</a>
</div>

<div markdown="1" class="ui tab segment active" data-tab="work-and-speed" >
  {% include_relative include_single_core_computing/work_and_speed.md %}
</div>
<div markdown="1" class="ui tab segment" data-tab="time-sharing">
  {% include_relative include_single_core_computing/timesharing.md %}
</div>
<div markdown="1" class="ui tab segment" data-tab="memory">
  {% include_relative include_single_core_computing/memory.md %}
</div>

<div markdown="1" class="ui tab segment" data-tab="io">
  {% include_relative include_single_core_computing/io.md %}
</div>

<div markdown="1" class="ui tab segment" data-tab="capstone">
  {% include_relative include_single_core_computing/capstone.md %}
</div>
