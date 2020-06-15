---
layout: page
title: 'B. Cyberinfrastructure Concepts'
order: 200
usemathjax: true
submodule: 'main'
submodulecat: 'cic'
---

<div markdown="1" class="ui tab segment active">
    <div class="modules">
        {% assign submodules = site.pedagogic_modules | where: "submodule",page.submodulecat | sort: "order" %}
        <ul>
            {% for submodule in submodules %}
            {% if submodule.title != null and submodule.layout == "page" %}
            <li>
                <h3><strong><a href="{{ site.baseurl }}{{ submodule.url }}">{{ submodule.title }}</a></strong></h3>
                <div class="excerpt">{{ submodule.excerpt | strip_html | strip_newlines | truncate: 160 }}</div>
                {% assign subsubmodules = site.pedagogic_modules | where:
                "submodule",submodule.submodulecat | sort: "order" %}
                <ul>
                    {% for subsubmodule in subsubmodules %}
                    {% if subsubmodule.title != null and subsubmodule.layout == "page" %}
                    <li>
                        <a href="{{ site.baseurl }}{{ subsubmodule.url }}">{{ subsubmodule.title }}</a>
                        <br/>
                        <div class="excerpt" style="padding-bottom: 1.5em">{{ subsubmodule.excerpt | strip_html | strip_newlines | truncate: 160 }}</div>
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
