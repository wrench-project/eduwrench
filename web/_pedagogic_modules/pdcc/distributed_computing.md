---
layout: page
title: 'A.3. Distributed Computing'
order: 130
usemathjax: true
submodule: 'pdcc'
submodulecat: 'distributed_computing'
---

<div class="info" style="margin-top: 2em; margin-bottom: 2em">
    <div class="goal mx-5">
        <div class="mCourses">
            <div class="row">
                <div class="courseBox col-12 px-6" style="margin-bottom: 1em">
                    <div class="ui tab segment active">
                        <div class="modules">
                            {% assign modules = site.pedagogic_modules | where: "submodule","distributed_computing" | sort: "order" %}
                            {% for module in modules %}
                            {% if module.title != null and module.layout == "page" %}
                            <ul>
                                <li>
                                    <strong><a href="{{ site.baseurl }}{{ module.url }}">{{ module.title }}</a></strong>
                                    <br/>
                                    <div class="excerpt" style="padding-bottom: 1.5em">{{ module.excerpt | strip_html | strip_newlines | truncate: 250 }}</div>
                                </li>
                            </ul>
                            {% endif %}
                            {% endfor %}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
