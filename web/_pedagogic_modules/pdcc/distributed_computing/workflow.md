---
layout: page
title: 'A.3.4 Workflows'
order: 135
usemathjax: true
submodule: 'distributed_computing'
---

The goal of this module is to introduce you to the workflow model of computation that is used in many real-world scientific applications.  

Go through the tabs below in sequence...

<div class="ui pointing secondary menu">
  <a class="item " data-tab="fundamentals">Fundamentals</a>
  <a class="item " data-tab="distributed-execution">Distributed Execution</a>
  <a class="item " data-tab="data-locality">Data Locality</a>
  <a class="item " data-tab="mixed-parallelism">Mixed Parallelism</a>
  <a class="item " data-tab="capstone">Capstone</a>
</div>

<div markdown="1" class="ui tab segment active" data-tab="fundamentals" >
  {% include_relative include_workflow/workflow_fundamentals.md %}
</div>
<div markdown="1" class="ui tab segment" data-tab="distributed-execution">
  {% include_relative include_workflow/workflow_distributed.md %}
</div>
<div markdown="1" class="ui tab segment " data-tab="data-locality">
  {% include_relative include_workflow/workflow_data_locality.md %}
</div>
<div markdown="1" class="ui tab segment " data-tab="mixed-parallelism">
  {% include_relative include_workflow/workflow_task_data_parallelism.md %}
</div>
<div markdown="1" class="ui tab segment " data-tab="capstone">
  {% include_relative include_workflow/workflow_capstone.md %}
</div>
