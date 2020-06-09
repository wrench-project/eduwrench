---
layout: page
title: 'A.2. Multi-core Computing'
order: 120
usemathjax: true
submodule: 'pdcc'
---

The goal of this module is to introduce you to multi-core computing (i.e., running a program on multiple cores within the same computer).

Go through the tabs below in sequence...

<div class="ui pointing secondary menu">
  <a class="item" data-tab="parallelism">Parallelism</a>
  <a class="item" data-tab="ram-and-io">RAM and I/O</a>
  <a class="item" data-tab="dependencies">Task Dependencies </a>
  <a class="item" data-tab="data-parallelism">Data Parallelism</a>
  <a class="item" data-tab="capstone">Capstone Exercise</a>
</div>

<div markdown="1" class="ui tab segment active" data-tab="parallelism">
  {% include_relative include_multi_core_computing/parallelism.md %}
</div>

<div markdown="1" class="ui tab segment" data-tab="ram-and-io">
  {% include_relative include_multi_core_computing/parallelism_ram_io.md %}
</div>

<div markdown="1" class="ui tab segment" data-tab="dependencies">
  {% include_relative include_multi_core_computing/task_dependencies.md %}
</div>

<div markdown="1" class="ui tab segment" data-tab="data-parallelism">
  {% include_relative include_multi_core_computing/data_parallelism.md %}
</div>

<div markdown="1" class="ui tab segment" data-tab="capstone">
  {% include_relative include_multi_core_computing/capstone.md %}
</div>
