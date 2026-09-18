---
layout: post
title: DP-100 Preparation Notes
date: 2025-04-05
permalink: /posts/2025/04/dp-100-preparation-notes/
excerpt_separator: <!--more-->
tags:
  - Azure
  - DP-100
image: /assets/img/posts/dp100-prep.png
toc: true
categories: ["Azure"]

---
My notes to prepare for DP-100 exam. This includes some important concepts which may help.

<!--more-->

Below topics are outdated, so you may not find it relevant anymore.

## ARFF - Attribute Relation File Format

- Use the Convert to ARFF module in Azure Machine Learning Studio, to convert datasets and results in Azure Machine Learning to the attribute-relation file format used by the Weka toolset.
- The ARFF data specification for Weka supports multiple machine learning tasks, including data preprocessing, classification, and feature selection. In this format, data is organized by entities and their attributes, and is contained in a single text file.

---
## Clean Missing Data module in Azure ML

- Custom substitution value: Use this option to specify a placeholder value (such as a 0 or NA) that applies to all missing values. The value that you specify as a replacement must be compatible with the data type of the column.
- Azure Machine Learning Studio provides multiple ways to handle missing data, including mean, median, mode, and custom substitution.
- This component supports multiple types of operations for "cleaning" missing values, including: Replacing missing values with a placeholder, mean, or other value Completely removing rows and columns that have missing values Inferring values based on statistical methods
	- Replace using MICE (Multivariate Imputation using Chained Equations)
	- Custom substitution value
	- Replace with mean
	- Replace with median: Calculates the column median value, and uses the median value as the replacement for any missing value in the column.
	- Replace with mode
	- Remove entire row
	- Replace using Probabilistic PCA

Convert to Indicator Values module in Machine Learning Studio
- The purpose of this module is to convert columns that contain categorical values into a series of binary indicator columns that can more easily be used as features in a machine learning model

---

Azure Databricks is a fast, easy, and collaborative Apache Spark-based analytics platform that provides a complete environment for data engineering, machine learning, and data science. It supports Python and Scala, and allows you to compose data storage, movement, and processing services into automated data pipelines. Azure Data Factory, on the other hand, is a cloud-based data integration service that allows you to create, schedule, and orchestrate your data pipelines. By using both Databricks and Data Factory together, you can have a unified platform for both data engineering and data science that also supports workload isolation and interactive workloads, as well as enables scaling across a cluster of machines.

---
## CUDA - Compute Unified Device Architecture

CUDA (Compute Unified Device Architecture) is a parallel computing platform and programming model developed by **NVIDIA**. It allows developers to harness the **power of NVIDIA GPUs** (Graphics Processing Units) to perform **general-purpose computing** tasks—beyond just graphics.

### 🔍 What does CUDA do?

It enables software developers to **run code on the GPU**, which can process thousands of threads simultaneously—greatly speeding up tasks that involve heavy computation like:

- Matrix operations
- Image and video processing
- Deep learning
- Scientific simulations

### 💻 How does it work?

Normally, your CPU does most of the computing. But with CUDA:

- You write programs (usually in C/C++ or Python via libraries like Numba or PyCUDA)
- These programs send compute-heavy parts to run on the GPU
- The GPU executes thousands of threads in parallel, much faster than a CPU can

### 🔧 Key Concepts:

- **Kernels**: Functions written to run on the GPU
- **Threads**: Lightweight processes that run in parallel on the GPU
- **Blocks and Grids**: Threads are organized in blocks, and blocks in grids, allowing structured parallel computation

### ⚡ Example Use Cases:

- **AI/ML frameworks** like TensorFlow or PyTorch use CUDA under the hood to train models faster
- **Gaming engines** for real-time physics or rendering
- **Financial simulations**, **medical imaging**, etc.

### 🐍 Python Example (Using `Numba` for CUDA)

Numba is a Python library that allows you to write CUDA kernels using Python syntax.

```python
from numba import cuda
import numpy as np

# Kernel function to add two vectors
@cuda.jit
def add_vectors_gpu(a, b, result):
    idx = cuda.grid(1)  # Get global thread ID
    if idx < a.size:
        result[idx] = a[idx] + b[idx]

# Host code
n = 1000
a = np.random.rand(n).astype(np.float32)
b = np.random.rand(n).astype(np.float32)
result = np.zeros(n, dtype=np.float32)

# Transfer to device and call kernel
threads_per_block = 256
blocks_per_grid = (n + (threads_per_block - 1)) // threads_per_block
add_vectors_gpu[blocks_per_grid, threads_per_block](a, b, result)

print("First 10 results:", result[:10])

```

### 🎯 **Goal:**

We’re using the **GPU** to add two vectors (arrays) of 1000 random numbers each, element by element.

### 🔧 Step-by-step Explanation:

#### 1. **Imports:**

```python
from numba import cuda
import numpy as np
```

- `numba.cuda`: Lets us write GPU (CUDA) kernels in Python.
- `numpy`: Used to generate and manipulate arrays.

#### 2. **CUDA Kernel Function:**

```python
@cuda.jit
def add_vectors_gpu(a, b, result):
    idx = cuda.grid(1)  # Get the global thread ID
    if idx < a.size:
        result[idx] = a[idx] + b[idx]
```

- This function runs on the **GPU**, not the CPU.
- `@cuda.jit` makes it a CUDA kernel.
- `cuda.grid(1)` returns the **index of the thread** running the code (1D grid in this case).
- Each thread adds one element from `a` and `b` and stores it in `result`.

💡 Think of it as 1000 mini-workers (GPU threads), each doing one addition at the same time.

#### 3. **Create Vectors:**

```python
n = 1000
a = np.random.rand(n).astype(np.float32)
b = np.random.rand(n).astype(np.float32)
result = np.zeros(n, dtype=np.float32)
```

- Create two arrays `a` and `b` with 1000 random float numbers.
- `result` is an empty array to store the output.
- We use `float32` to make sure it's compatible with the GPU (as GPUs usually work with 32-bit floats).

#### 4. **Kernel Launch Configuration:**

```python
threads_per_block = 256
blocks_per_grid = (n + (threads_per_block - 1)) // threads_per_block
```

- CUDA divides the work into **blocks** and **threads**.
- Each block contains 256 threads here.
- This line ensures we create **enough blocks** to cover all 1000 elements.

#### 5. **Call the Kernel (Run on GPU):**

```python
add_vectors_gpu[blocks_per_grid, threads_per_block](a, b, result)
```

- Launch the kernel with `[blocks, threads]` syntax.
- This runs the `add_vectors_gpu` function **in parallel on the GPU**.

#### 6. **Print Result:**

```python
print("First 10 results:", result[:10])
```

- Shows the first 10 values of the result, just to confirm the addition worked correctly.

### 🧠 In Simple Terms:

It’s like you're hiring 1000 workers (GPU threads) to each do one tiny task at the same time:  
**add a[i] + b[i] → result[i]**

This is what makes GPU computing so powerful for large-scale tasks!

---
## Deep Learning Virtual Machine (DLVM)

A **Deep Learning Virtual Machine** is a ready-to-use virtual environment designed for training and deploying deep learning models. It comes pre-loaded with all the tools and libraries needed for machine learning and AI tasks.

### 🔑 Key Features:

- **Pre-installed Tools:** DLVMs include popular deep learning frameworks like TensorFlow, PyTorch, and Keras, along with data science tools like Jupyter Notebook and scikit-learn.
    
- **GPU Acceleration:** These machines often support GPUs, allowing much faster processing, especially for training large neural networks.
    
- **Cloud-based & Scalable:** You can easily scale up (more power) or down (less cost) depending on the size of your project.

### ⚙️ Typical Use Cases:

- Training deep learning models
- Running experiments with large datasets
- Deploying AI models into production
- Collaborating on machine learning projects without worrying about setting up the environment

### 🎯 Benefits:

- **No Setup Hassle:** Everything is ready from the start, so you save time on installing libraries.
- **Consistency:** Everyone on the team works in the same environment.
- **Flexibility:** Run your code on powerful hardware without owning it, using cloud providers.

In short, DLVMs give you a powerful, plug-and-play workspace to build, test, and run deep learning models efficiently.

---
## 💻 Data Science Virtual Machine

A **Data Science Virtual Machine** is a **pre-configured virtual environment** designed specifically for data science and machine learning tasks. It includes a collection of **popular tools, frameworks, and libraries** so you can start analyzing data or building models without setting anything up manually.

### 🧰 What’s Inside a DSVM?

- **Programming Languages:** Python, R, Julia, etc.
- **IDE Tools:** Jupyter Notebook, Visual Studio Code, RStudio
- **ML Libraries:** scikit-learn, TensorFlow, PyTorch, XGBoost
- **Data Tools:** Pandas, NumPy, SQL clients
- **Big Data Tools (optional):** Apache Spark, Hadoop
- **Visualization Tools:** Power BI, Matplotlib, Seaborn

### 🚀 Key Benefits:

- **Ready-to-Use Environment:** No need to install anything—just log in and start working.
- **Cross-Platform:** Works on Windows or Linux, usually available on cloud platforms like Azure, AWS, or Google Cloud.
- **GPU/CPU Support:** You can run it with high-powered CPUs or GPUs for faster computation.
- **Consistency:** Everyone on your team can use the same environment, reducing “it works on my machine” issues.

### 📦 Typical Use Cases:

- Data exploration and analysis
- Machine learning and deep learning model development
- Building dashboards and visualizations
- Teaching or collaborative projects
- Working with big datasets in the cloud

### 🔄 DSVM vs DLVM:

| Feature   | Data Science VM                | Deep Learning VM                |
| --------- | ------------------------------ | ------------------------------- |
| Tools     | Broader (Data analysis + ML)   | Focused on deep learning        |
| Libraries | Python, R, SQL tools, BI tools | TensorFlow, PyTorch, CUDA, etc. |
| Use Case  | General Data Science           | Intensive model training        |

In short, a **Data Science Virtual Machine** is like a fully stocked workstation in the cloud—ready for any data science task the moment you turn it on.

---
## 🤖 What is Caffe2

**Caffe2** is a **lightweight, modular, and scalable deep learning framework** developed by Facebook (now Meta). It's designed to be **flexible and production-ready**, allowing developers to train and deploy deep learning models efficiently on **mobile devices**, **cloud servers**, and **edge devices**.

### 🧠 Key Features of Caffe2:

- **Cross-platform support:** Works on CPU and GPU, and supports Android and iOS.
- **Highly scalable:** Suitable for both small experiments and large-scale production.
- **Optimized performance:** Designed to work efficiently with hardware acceleration (like CUDA, MKL).
- **Mobile-first:** One of the first frameworks focused on deploying deep learning models on mobile phones.
- **Modular architecture:** Easy to plug and play different components.

### 🔄 Caffe2 vs PyTorch

- **Caffe2** was originally separate from **PyTorch**    
- In 2018, **Facebook merged Caffe2 into PyTorch** to unify both frameworks.
- Now, PyTorch incorporates Caffe2's strengths in deployment and mobile support.

### 💡 Use Cases:

- Real-time image recognition on mobile devices
- Deploying trained models in production environments
- Running inference on edge devices with limited resources

**Caffe2** was built for performance, portability, and flexibility—especially focused on deploying deep learning models beyond just research labs. While it's now part of **PyTorch**, many of its capabilities live on in tools like **TorchScript** and **PyTorch Mobile**.

- Caffe2 was officially supported on **Ubuntu 16.04**.
- Ubuntu provides better GPU support and compatibility with frameworks like CUDA and cuDNN, which are crucial for running Caffe2.
- Windows Server versions and CentOS were either not officially supported or more difficult to configure for Caffe2.

---
## What is Geo-DSVM?

A **Geo AI Data Science Virtual Machine (Geo-DSVM)** is a specialized type of **Data Science Virtual Machine (DSVM)** offered by Microsoft Azure that is pre-configured for **geospatial analytics and AI workloads**.

- A **Geo-DSVM** is a Windows-based virtual machine optimized for **geospatial data science tasks**.
- It comes pre-installed with:
    - **ESRI ArcGIS Pro** (a leading GIS tool)
    - **AI and machine learning frameworks** like TensorFlow, PyTorch
    - **Azure Machine Learning tools**
    - Tools for working with **satellite imagery**, **remote sensing**, and **geospatial data processing**

### 💡 Main Use Cases

- Satellite image analysis
- Geospatial predictive modeling
- Urban planning and location-based insights
- Natural disaster prediction using maps and imagery

---
## SMOTE Module in Azure ML

In **Azure Machine Learning**, **SMOTE** (Synthetic Minority Oversampling Technique) is a technique used to handle **imbalanced datasets**—where one class (usually the "positive" or "minority" class) has significantly fewer instances than the other.

### 🔍 What is SMOTE?

SMOTE generates **synthetic samples** for the minority class by interpolating between existing minority class examples. It helps improve model performance by **balancing the dataset** before training.

### 📦 SMOTE in Azure Machine Learning

You can use SMOTE in Azure ML via:

#### 1. **Designer (Visual Interface)**

In Azure ML Designer, you can use:

- **“SMOTE” module** (under _Data Transformation > Sample and Split_).
- It allows you to apply SMOTE without writing code.

##### Inputs:

- A dataset with labeled classes.
- The **target column** that indicates the class label.

##### Configurable parameters:

- **SMOTE percentage**: How many new synthetic samples to generate.
- **k-nearest neighbors**: Controls how synthetic samples are created.
- **Random seed** (optional): For reproducibility.

##### Outputs:

- A new, **balanced dataset** with synthetic samples added.

#### 2. **Python SDK (Custom Code in Notebooks)**

If you're using a Jupyter notebook or script in Azure ML, you can implement SMOTE using libraries like **`imblearn`**:

```python
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import train_test_split

# Split features and target
X = df.drop('target', axis=1)
y = df['target']

# Apply SMOTE
smote = SMOTE()
X_resampled, y_resampled = smote.fit_resample(X, y)
```

### ✅ When to Use SMOTE?

- When dealing with **binary classification** problems with **class imbalance** (e.g., fraud detection, churn prediction).
- Before training a model to ensure it **doesn’t bias toward the majority class**.

### 🚫 Caution:

- Always apply SMOTE **only on training data**, not on the test/validation set.    
- Overuse can lead to **overfitting** due to the synthetic nature of data.

---
## Azure Notebooks

Azure Notebooks is a free service that provides Jupyter notebooks that are hosted in the cloud. The service allows users to write and execute Python (among other languages) code in their browsers without the need for any configuration or installation of software on the local machine. This makes it an ideal solution for scenarios where learners do not have administrator permissions to install software and cannot access Azure subscriptions directly.

---
## Poisson Regression

Poisson regression is intended for use in regression models that are used to predict numeric values, typically counts. 

Therefore, you should use this module to create your regression model only if the values you are trying to predict fit the following conditions:

- The response variable has a Poisson distribution.
- Counts cannot be negative. The method will fail outright if you attempt to use it with negative labels.
- A Poisson distribution is a discrete distribution; therefore, it is not meaningful to use this method with non-whole numbers.  

---

You can move data to and from Azure Blob storage using different technologies:  
- Azure Storage-Explorer
- AzCopy
- Python
- SSIS

## AzCopy

AzCopy is a command-line utility specifically designed for transferring data to and from Azure Blob Storage. It provides robust functionality for uploading data from local machines to Azure Blob Storage containers. The tool supports creating new containers and offers various data transfer options including uploading individual files, entire directories, or specific file patterns

AzCopy requires authorization credentials (typically using a Shared Access Signature token or Azure Active Directory) to establish connections with Azure Blob Storage. Once configured, it provides efficient data transfer capabilities essential for preparing datasets for Azure Machine Learning workloads

## SSIS (SQL Server Integration Services)

SSIS offers comprehensive data integration capabilities for moving data from various sources into Azure Blob Storage. When working with large datasets for machine learning purposes, SSIS provides multiple methodologies for data transfer:

- The fastest approach involves a two-step process: first exporting data to local files using Export Tasks, then uploading these files to Azure Blob Storage using the Azure Blob Storage Task
- SSIS supports data compression (e.g., GZip format) to accelerate uploads and reduce data transfer costs[4]
- It enables file splitting by row count, which can be advantageous for parallel processing in machine learning pipelines[4]
- SSIS allows highly parallel uploads for maximum transfer speeds with large datasets

## Azure Storage Explorer

Azure Storage Explorer provides a graphical user interface for managing Azure Blob Storage resources. This tool facilitates data uploads to Azure Blob Storage through an intuitive interface, making it appropriate for users who prefer GUI-based interactions over command-line operations. Storage Explorer allows browsing, uploading, downloading, and managing files and containers within Azure Blob Storage.
