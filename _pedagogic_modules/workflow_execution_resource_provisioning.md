---
layout: page
title: 'H. Workflows and Resource Provisioning'
order: 800
---

1. [Learning objectives](#learning-objectives)
2. [Overview](#overview)
2. [Case Study](#case-study)
3. [Activity](#activity)
3. [Conclusion](#conclusion)

# Learning Objectives

- Be able to make calculated platform design decisions for optimizing workflow executions;
- Be able to apply the knowledge acquired in all previous modules in a holistic manner.

# Overview

This module does not introduce any new concepts, 
but instead incorporates
all concepts acquired in the previous modules.  It is a
case study in which you analyze a given workload on a given
cyberinfrastructure. Then you will need to come up with an argument as to
how this workload can be executed faster, given certain constraints. You
will be guided through the decision making process so that you can build up
your argument.

## Case Study

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflow_execution_resource_provisioning/workflow.svg">Workflow</object>

You are a software engineer at a large corporation that routinely executes
workflows for many customer applications. You have been tasked with
ensuring that a particular workflow (Figure 1), which is
executed repeatedly on different input files, runs as efficiently as
possible on your corporation's cyberinfrastructure (Figure 2).  Your
customers produce the input files, which are always the same size, at the
remote storage service.  The workflow's single output file must be stored,
once it's been created, at that same storage service. All computation takes
place on your corporation's compute service (CS).

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflow_execution_resource_provisioning/cyber_infrastructure.svg">Platform</object>

The Workflow Management System (WMS) that your corporation uses for this
workflow submits tasks to the CS with the following scheme regarding
file operations: read the initial input files from the remote
storage service, write the final output file to the remote storage service,
read and write all other files using the CS's scratch space. This scheme is depicted in Figure 3.

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflow_execution_resource_provisioning/wms.svg">WMS Scenario</object>

### The Problem

Up until now, your customers have been producing input files at roughly the
same rate as you are able to execute the workflow.  However, they have
recently upgraded their process and now produce input files at a faster
rate. The workflow execution on the cyberinfrastructure can no longer keep
up and has become a performance, and revenue, bottleneck!

You immediately get in touch with your boss about this, and come to the
agreement that **$1500** will be budgeted for to you to upgrade the
cyberinfrastructure. The goal is to  accelerate the
workflow execution as
much as possible.

Your boss does not care if the total amount spent is less than the allotted
$1500, but before making the purchase you must make a valid case as to why
the upgrade(s) you choose is/are warranted.


# Upgrading the Cyberinfrastructure

## Step 1: Evaluate All the Options

<object class="figure" type="image/svg+xml" data="{{ site.baseurl }}/public/img/workflow_execution_resource_provisioning/upgrades.svg">Upgrades</object>

Your cyberinfrastructure provider says they can offer you several hardware
upgrades for various costs, as shown in Figure 4.
Given your budget, you thus have 3 options:

| Option | Cores |  RAM  | Link Bandwidth |  Cost  |
|:------:|:-----:|:-----:|:--------------:|:------:|
|    1   |   2   | 32 GB |  1,000 MB/sec  | $1,500 |
|    2   |   4   | 16 GB |  1,000 MB/sec  | $1,400 |
|    3   |   4   | 32 GB |   100 MB/sec   |  $700  |


**Answer these questions**

**[H.q1.1]** Without an upgrade, about how long do you estimate the workflow execution to take?
        Write a simple formula that shows your work.

**[H.q1.2]** Going with *Option 1*, about how long do you estimate the workflow execution to take?
        Write simple formula that shows your work.

**[H.q1.3]** Going with *Option 2*, about how long do you estimate the workflow execution to take?
        Write simple formula that shows your work.

**[H.q1.4]** Going with *Option 3*, about how long do you estimate the workflow execution to take?
        Write simple formula that shows your work.

## Step 2: Select the Best Upgrade

**Answer these questions**

**[H.q1.5]** Which option gives you the fastest workflow execution time? Your answer
       is of course based on your answers in the previous step. But also give an intuitive reason why the best option is
       indeed the best.

**[H.q1.6]** What is the CS's estimated utilization with the best option?

**[H.q1.7]** How does it compare with the estimated utilization of the current non-upgraded cyberinfrastructure?

**[H.q1.8]** Write several sentences (not more than 5) to convince your boss that you have found the best hardware upgrade.
      Use your findings from the previous step to strengthen your claim.

## Step 3: Considering Other Scenarios

There is some notion that data will change in the future, with different file sizes. Although this has not happened
yet, your boss asks you for some information about how different file sizes may change your current decisions.

**Answer these questions**

**[H.q1.9]** Assuming the input file size is now 7 GB (all three files), what would the CS's estimated utilization be with the *best option*?
       Write a short sentence explaining why the estimated utilization here is different from what you calculated in q6.

**[H.q1.10]** Assuming the input file size is now 7 GB (all three files), which option would be the *best option*?

**[H.q1.11]** At what input file size would the *best option*  (i.e., your answer for q5) no longer be the best option?

# Conclusion

In this activity, you have put to use some of the concepts learned thus far. By having
a good understanding of your workload and the platform on which it runs, you were able to make
a calculated decision as to what hardware upgrades would benefit you the most. First, you identified
the current workflow execution time as a baseline performance metric. Second, you enumerated the possible
upgrade options and, using back-of-the-envelope calculations, estimated how they compare with the baseline.
This allowed you to make a sound decision as to which hardware upgrade would best meet the
requirements laid out by your boss. As a result, the money was put to good use and workflow execution
performance is improved, for now...

Based on your answers from Step #3, it should be clear that the "best option"
is not always the *best*. When file sizes vary, one option might be better than the other.
Purchasing a certain hardware upgrade may be the right
way to approach a performance related issue in some cases but not all.

{% comment %}

In the next activity, "Activity 4: Some Name To Do With Varying File Sizes", we explore
the effects of varying file sizes on workflow execution performance.  

{% endcomment %}
