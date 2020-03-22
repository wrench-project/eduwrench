---
layout: page
title: 'Our Courses'
permalink: /courses
---

<div class="info" style="margin-top: 2em">
    <div class="goal mx-5">
        <div class="mCourses">
            <div class="row">
                {% assign modules = site.pedagogic_modules | where: "submodule","main" | sort: "order" %}
                {% for module in modules %}
                {% if module.title != null and module.layout == "page" %}
                <div class="courseBox col-6 px-6" style="margin-bottom: 1em">
                    <div class="ui tab segment active">
                        <div class="modules">
                            <h3>{{ module.title }}</h3>
                            {% assign submodules = site.pedagogic_modules | where: "submodule",module.submodulecat |
                            sort: "order" %}
                            <ul>
                                {% for submodule in submodules %}
                                {% if submodule.title != null and submodule.layout == "page" %}
                                <li>
                                    <a href="{{ site.baseurl }}{{ submodule.url }}">{{ submodule.title }}</a>
                                    {% assign subsubmodules = site.pedagogic_modules | where:
                                    "submodule",submodule.submodulecat | sort: "order" %}
                                    <ul>
                                        {% for subsubmodule in subsubmodules %}
                                        {% if subsubmodule.title != null and subsubmodule.layout == "page" %}
                                        <li>
                                            <a href="{{ site.baseurl }}{{ subsubmodule.url }}">
                                                {{ subsubmodule.title }}</a>
                                        </li>
                                        {% endif %}
                                        {% endfor %}
                                    </ul>
                                </li>
                                {% endif %}
                                {% endfor %}
                            </ul>
                        </div>
                    </div>
                </div>
                {% endif %}
                {% endfor %}
            </div>
        </div>
    </div>
</div>