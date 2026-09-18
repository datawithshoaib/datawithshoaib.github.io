---
layout: post
title: Storage Blob in Azure
date: 2024-12-20
permalink: /posts/2024/12/storage-blob-in-azure/
tags:
  - Azure
  - Storage
image: /assets/img/posts/az-strblb.png
toc: true
categories: ["Azure"]

---

Understanding how to create a storage blob in Azure.

## Steps to create a new storage account.

Sign in to the Azure portal at https://portal.azure.com

Select Create a resource.

Under Categories, select Storage.

Under Storage account, select Create.

![alt text]({{ site.baseurl }}/assets/img/posts/blob/image.png)

![alt text]({{ site.baseurl }}/assets/img/posts/blob/image-1.png)

On the Advanced tab of the Create a storage account blade, fill in the following information.

![alt text]({{ site.baseurl }}/assets/img/posts/blob/image-4.png)

click review + create

Select Go to resource.

## Work with blob storage

![alt text]({{ site.baseurl }}/assets/img/posts/blob/image-5.png)

I have created a container named "data" here

![alt text]({{ site.baseurl }}/assets/img/posts/blob/image-2.png)

Click on the container and upload anything. I have uploaded an image.

![alt text]({{ site.baseurl }}/assets/img/posts/blob/image-3.png)

Now, if we click on the image, it opens up properties which consists of an URL.

This URL enables to access the image online.

### Change the access level of your blob

Select Change access level.

Set the Anonymous access level to Blob (anonymous read access for blobs only).

![alt text]({{ site.baseurl }}/assets/img/posts/blob/image-6.png)

Now, you should be able to access the image through URL, initially it was set to private.

--- 

Done!!!
