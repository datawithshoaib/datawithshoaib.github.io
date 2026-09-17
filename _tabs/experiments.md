---
layout: page
title: Experiments
icon: fas fa-flask
order: 2
permalink: /experiments/
---

<p class="lead">A collection of small AI experiments, tooling notes, and practical concept explorations.</p>

{% assign experiments = site.experiments | sort: 'date' | reverse %}

<div id="post-list" class="flex-grow-1 px-xl-1">
  {% for experiment in experiments %}
    <article class="card-wrapper card">
      <a href="{{ experiment.url | relative_url }}" class="post-preview row g-0 flex-md-row-reverse">
        <div class="col-md-12">
          <div class="card-body d-flex flex-column">
            <h1 class="card-title my-2 mt-md-0">{{ experiment.title }}</h1>

            <div class="card-text content mt-0 mb-3">
              <p>
                {% if experiment.excerpt %}
                  {{ experiment.excerpt | strip_html | truncate: 180 }}
                {% else %}
                  {{ experiment.content | strip_html | truncate: 180 }}
                {% endif %}
              </p>
            </div>

            <div class="post-meta flex-grow-1 d-flex align-items-end">
              <div class="me-auto">
                <i class="far fa-calendar fa-fw me-1"></i>
                {% include datetime.html date=experiment.date lang=lang %}

                {% if experiment.categories.size > 0 %}
                  <i class="far fa-folder-open fa-fw me-1"></i>
                  <span class="categories">
                    {% for category in experiment.categories %}
                      {{ category }}
                      {%- unless forloop.last -%},{%- endunless -%}
                    {% endfor %}
                  </span>
                {% endif %}
              </div>
            </div>
          </div>
        </div>
      </a>
    </article>
  {% endfor %}
</div>
