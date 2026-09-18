---
# the default layout is 'page'
icon: fas fa-info-circle
order: 7
---

<Layout title="Skills">
  <!-- Page header -->
  <section class="bg-canvas border-b border-hairline py-16 md:py-20" aria-label="Skills header">
    <div class="container-page max-w-5xl">
      <span class="section-eyebrow block mb-3">Capabilities</span>
      <h1 class="text-4xl md:text-5xl font-semibold tracking-[-0.05em] text-ink leading-tight mb-4">
        Technical Skillset.
      </h1>
      <p class="text-lg text-body leading-7">
        The tools, frameworks, and methods I use to turn raw data into insight and deployed products.
      </p>
    </div>
  </section>

  <!-- Skills grid -->
  <section class="section bg-canvas-soft" id="skills" aria-label="Skills">
    <div class="container-page max-w-5xl">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <!-- Machine Learning -->
        <div class="skill-card">
          <div class="skill-card-icon"><i class="fas fa-chart-line"></i></div>
          <h3>Machine Learning</h3>
          <ul class="skill-list">
            <li>Supervised &amp; Unsupervised Learning</li>
            <li>Feature Engineering</li>
            <li>Model Evaluation &amp; Tuning</li>
            <li>Scikit-learn Pipelines</li>
            <li>Exploratory Data Analysis</li>
          </ul>
        </div>

        <!-- Deep Learning -->
        <div class="skill-card">
          <div class="skill-card-icon"><i class="fas fa-network-wired"></i></div>
          <h3>Deep Learning &amp; NLP</h3>
          <ul class="skill-list">
            <li>TensorFlow &amp; Keras</li>
            <li>Neural Networks</li>
            <li>RNN, LSTM &amp; GRU</li>
            <li>Text Classification</li>
            <li>Sentiment Analysis</li>
          </ul>
        </div>

        <!-- Data & Programming -->
        <div class="skill-card">
          <div class="skill-card-icon"><i class="fab fa-python"></i></div>
          <h3>Data &amp; Programming</h3>
          <ul class="skill-list">
            <li>Python, Pandas &amp; NumPy</li>
            <li>SQL (Server, Postgres, MySQL)</li>
            <li>Matplotlib &amp; Seaborn</li>
            <li>Data Cleaning &amp; Transformation</li>
            <li>Statistics &amp; Experimentation</li>
          </ul>
        </div>

        <!-- ML Engineering -->
        <div class="skill-card">
          <div class="skill-card-icon"><i class="fas fa-cogs"></i></div>
          <h3>ML Engineering Foundation</h3>
          <ul class="skill-list">
            <li>Azure, Databricks &amp; Fabric</li>
            <li>ETL / ELT Pipelines</li>
            <li>Git &amp; Reproducible Workflows</li>
            <li>Streamlit Applications</li>
            <li>Power BI &amp; Data Storytelling</li>
          </ul>
        </div>

      </div>
    </div>
  </section>
</Layout>
