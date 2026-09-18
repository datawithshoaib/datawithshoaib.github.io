---
layout: post
title: Azure Virtual Machine
date: 2024-12-15
permalink: /posts/2024/12/azure-virtual-machine/
tags:
  - Azure
  - VMs
image: /assets/img/posts/azvm.png
toc: true
categories: ["Azure"]

---

Understanding and implementing Azure VM

## Creating an Azure virtual machine

Task: Create a Linux VM and install Nginx (a pupular web server)

In the terminal, use the command "az" to use Azure CLI

### Creating VM in Azure CLI

```shell
az vm create 
    --resource-group "learn-ed0873cc-022a-46d3-97cf-9f4621da3cf9"
    --name my-vm 
    --public-ip-sku Standard 
    --image Ubuntu2204 
    --admin-username azureuser 
    --generate-ssh-keys
```

#### Explanation

1. **`az vm create`**
   - This is the base command used to create a virtual machine in Azure.

---

2. **`--resource-group "learn-ed0873cc-022a-46d3-97cf-9f4621da3cf9"`**
   - Specifies the Azure **resource group** where the VM will be created.

---

3. **`--name my-vm`**
   - Sets the name of the VM to `my-vm`.

---

4. **`--public-ip-sku Standard`**
   - Specifies the type of public IP address assigned to the VM.
   - **Standard**: Provides more features, such as zone-redundancy and higher reliability, compared to the **Basic** SKU.

---

5. **`--image Ubuntu2204`**
   - Specifies the image used for the VM's operating system.
   - `Ubuntu2204` refers to the **Ubuntu 22.04 LTS** image, which is a long-term support version of the Ubuntu Linux OS.

---

6. **`--admin-username azureuser`**
   - Sets the username for the admin account on the VM to `azureuser`.
   - This username will be used to log in to the VM.

---

7. **`--generate-ssh-keys`**
   - Automatically generates a new SSH key pair (if one doesn't already exist in the default location, typically `~/.ssh`).
   - The public key is stored in the VM to enable secure SSH access.

---

##### What Happens When You Run This Command?

1. Azure creates a new VM named `my-vm` within the specified resource group.
2. The VM runs **Ubuntu 22.04 LTS**.
3. A **public IP address** is assigned to the VM using the **Standard** SKU.
4. The admin username is set to `azureuser`.
5. SSH key pair is generated (or reused if existing) to allow secure login to the VM.

After the VM is created, you can connect to it using SSH with a command like:

  ```bash
  ssh azureuser@<PUBLIC_IP_ADDRESS>
  ```

Replace `<PUBLIC_IP_ADDRESS>` with the actual public IP address assigned to your VM.

---
## Configuring Nginx on our VM

```shell
az vm extension set 
    --resource-group "learn-ed0873cc-022a-46d3-97cf-9f4621da3cf9" 
    --vm-name my-vm 
    --name customScript 
    --publisher Microsoft.Azure.Extensions 
    --version 2.1 
    --settings '{"fileUris":["https://raw.githubusercontent.com/MicrosoftDocs/mslearn-welcome-to-azure/master/configure-nginx.sh"]}' 
    --protected-settings '{"commandToExecute": "./configure-nginx.sh"}'
```

### Explanation

This Azure CLI command adds an **extension** to an existing virtual machine (VM) to run a custom script. It uses the **Custom Script Extension** provided by Microsoft.

---

1. **`az vm extension set`**
   - This command sets (installs or configures) an extension on an Azure virtual machine.

---

2. **`--resource-group "learn-ed0873cc-022a-46d3-97cf-9f4621da3cf9"`**
   - Specifies the **resource group** where the VM resides.

---

3. **`--vm-name my-vm`**
   - Specifies the name of the virtual machine (`my-vm`) to which the extension will be added.

---

4. **`--name customScript`**
   - Specifies the name of the extension. 
   - **`customScript`** is used to run scripts on the VM.

---

5. **`--publisher Microsoft.Azure.Extensions`**
   - Specifies the publisher of the extension. 
   - **Microsoft.Azure.Extensions** is the official publisher for the Custom Script Extension.

---

6. **`--version 2.1`**
   - Specifies the version of the extension.

---

7. **`--settings`**
   - Provides the settings required by the extension in JSON format.
   - In this case:
     ```json
     {
       "fileUris": [
         "https://raw.githubusercontent.com/MicrosoftDocs/mslearn-welcome-to-azure/master/configure-nginx.sh"
       ]
     }
     ```
     - **`fileUris`**: Points to a publicly accessible script file, `configure-nginx.sh`, hosted on GitHub. This file will be downloaded to the VM.

---

8. **`--protected-settings`**
   - Contains sensitive settings in JSON format that are securely passed to the extension (e.g., commands, secrets).
   - In this case:
     ```json
     {
       "commandToExecute": "./configure-nginx.sh"
     }
     ```
     - **`commandToExecute`**: Specifies the command to execute on the VM.
     - Here, it runs the `configure-nginx.sh` script, which is expected to configure NGINX on the VM.

---
#### What Happens When This Command Runs?

1. The **Custom Script Extension** is added to the VM (`my-vm`) in the specified resource group.
2. The extension:
   - Downloads the script (`configure-nginx.sh`) from the provided URL (`fileUris`).
   - Executes the script on the VM using the command specified in `commandToExecute`.
3. The script's purpose (e.g., installing and configuring NGINX) is defined within `configure-nginx.sh`.

---
## Code inside script file

```bash
#!/bin/bash

# Update apt cache.
sudo apt-get update

# Install Nginx.
sudo apt-get install -y nginx

# Set the home page.
echo "<html><body><h2>Welcome to Azure! My name is $(hostname).</h2></body></html>" | sudo tee -a /var/www/html/index.html
```

### Explanation
#### 1. `#!/bin/bash`

   - Indicates that the script should be executed using the **Bash shell**.

---

#### 2. `sudo apt-get update`

   - Updates the local package database on the system.
   - Ensures the package manager (`apt-get`) has the latest information about available software versions and dependencies.

---

#### 3. `sudo apt-get install -y nginx`

   - Installs **NGINX** (a web server).
   - The `-y` flag automatically confirms any prompts during installation, making it non-interactive.

---

#### 4. `echo "<html><body><h2>Welcome to Azure! My name is $(hostname).</h2></body></html>" | sudo tee -a /var/www/html/index.html`

   - Creates a custom **HTML homepage** for the NGINX server by:
     1. Using the `echo` command to generate an HTML string.
     2. Injecting the VM's hostname into the page dynamically using the `$(hostname)` command.
        - The hostname is the unique name of the VM in the network
     3. Writing the generated HTML content into the **`/var/www/html/index.html`** file, which is the default NGINX homepage.
        - **`sudo tee -a`** appends the content to the file, ensuring it has the required permissions.

---
### What the Script Does

1. **Updates the system's package database** to ensure the latest software is installed.
2. **Installs NGINX** using the `apt-get` package manager.
3. **Creates a custom NGINX homepage** that displays a personalized message:

   ```
   Welcome to Azure! My name is <hostname>.
   ```

where `<hostname>` is replaced by the VM's hostname.

---
## Configure network access

To verify the VM we created is running, use below command

```shell
az vm list
```

### Task 1: Access your web server

```shell
IPADDRESS="$(az vm list-ip-addresses 
   --resource-group "learn-37910ddf-3b1e-45a8-810b-3e38eb918813" 
   --name my-vm 
   --query "[].virtualMachine.network.publicIpAddresses[*].ipAddress" 
   --output tsv)"
```
#### Explanation

This is a **Bash command** that retrieves the **public IP address** of a specific Azure virtual machine (VM) using the Azure CLI and stores it in a variable called `IPADDRESS`.

#### 1. `IPADDRESS="$( ... )"`

   - Assigns the output of the command inside `$( ... )` to the variable `IPADDRESS`.
   - In this case, `IPADDRESS` will hold the public IP address of the VM.

---
#### 2. `az vm list-ip-addresses`

   - Azure CLI command to retrieve IP address information for one or more VMs.
   - Returns details such as private IPs, public IPs, and network interface information.

---
#### 3. `--resource-group "learn-37910ddf-3b1e-45a8-810b-3e38eb918813"`

   - Specifies the **resource group** where the VM is located.
   - The resource group name here is `learn-37910ddf-3b1e-45a8-810b-3e38eb918813`.

---
#### 4. `--name my-vm`

   - Specifies the name of the virtual machine (`my-vm`) for which the IP address will be retrieved.

---
#### 5. `--query "[].virtualMachine.network.publicIpAddresses[*].ipAddress"`

   - Filters the output using **Azure CLI JMESPath query syntax** to return only the public IP address.
	   - `[].virtualMachine.network.publicIpAddresses[*].ipAddress`:
       - Accesses the public IP address field for the VM(s).
       - The `[*]` handles cases where there might be multiple public IPs, though typically there's only one.

---
#### 6. `--output tsv`

   - Specifies the output format as **Tab-Separated Values (TSV)**.
   - Outputs the public IP address as plain text, removing additional formatting like JSON brackets or quotes.

---
##### What Happens When This Command Runs?

1. The Azure CLI retrieves information about the VM (`my-vm`) in the specified resource group.
2. The **query** filters the data to extract only the public IP address.
3. The result is stored in the `IPADDRESS` variable.

---

```sh
curl --connect-timeout 5 http://$IPADDRESS
```

### Explanation

This **cURL** command is used to test the connectivity to a web server hosted on the specified public IP address (`$IPADDRESS`)

---
#### 1. `curl`

   - A command-line tool used to transfer data or interact with URLs. It can send HTTP requests to test web servers or APIs.

---
#### 2. `--connect-timeout 5`

   - Sets the maximum time (in seconds) for cURL to establish a connection to the server.
   - If the connection cannot be established within **5 seconds**, the command will time out, and cURL will exit.

---
#### 3. `http://$IPADDRESS`

   - Specifies the URL to connect to:
     - **`http://`**: Indicates that the request uses the HTTP protocol.
     - **`$IPADDRESS`**: Refers to the variable containing the public IP address of the VM.
       - Example: If `IPADDRESS="20.50.60.70"`, this command attempts to access `http://20.50.60.70`.

---
#### What Happens When This Command Runs?

1. cURL attempts to establish a connection to the web server at the specified IP address on port 80 (default HTTP port).
2. If successful:
   - The server's response is displayed in the terminal, typically the content of the webpage (e.g., HTML output).
3. If it fails to connect within 5 seconds:
   - cURL exits with a timeout error.

---
### Expected Output

#### Case 1: Successful Connection

If the NGINX server is running and the custom homepage is configured,

```html
<html><body><h2>Welcome to Azure! My name is my-vm.</h2></body></html>
```

#### Case 2: Connection Timeout

If the server is not accessible within 5 seconds, you'll see an error like:

```plaintext
curl: (28) Connection timed out after 5001 milliseconds
```

Run the following to print your VM's IP address to the console:

```sh
echo $IPADDRESS
```

copy the ip address and paste in browser to test the connection, we can't connect now because our VM can't access the HTTP

---
## Task 2: List the current network security group rules

Run the following command to list the network security groups that are associated with your VM:

```sh
az network nsg list 
   --resource-group "learn-37910ddf-3b1e-45a8-810b-3e38eb918813" 
   --query '[].name' 
   --output tsv
```

Output:

```sh
my-vmNSG
```

### Explanation
This Azure CLI command retrieves the names of all **Network Security Groups (NSGs)** in a specific **resource group**.

#### 1. `az network nsg list`

   - **Command**: Lists all the **Network Security Groups (NSGs)** in your Azure account or in a specific **resource group**.
   - An NSG contains rules that allow or deny network traffic to and from Azure resources (like VMs).

---
#### 2. `--resource-group "learn-37910ddf-3b1e-45a8-810b-3e38eb918813"`

   - Specifies the **resource group** where the NSGs are located.
   - In this case, the resource group is `"learn-37910ddf-3b1e-45a8-810b-3e38eb918813"`.
   - Limits the query to the NSGs within this group.

---
#### 3. `--query '[].name'`

   - Filters the output to return only the **names** of the NSGs.
   - **`[].name`**:
     - **`[]`**: Accesses all items in the returned list of NSGs.
     - **`.name`**: Extracts the `name` property for each NSG.

---
#### 4. `--output tsv`

   - Specifies the output format as **Tab-Separated Values (TSV)**.
   - Removes JSON formatting and quotes, making the output plain text (ideal for scripts or other CLI commands).

---
#### What Happens When This Command Runs?

1. Azure CLI fetches all **NSGs** in the resource group `learn-37910ddf-3b1e-45a8-810b-3e38eb918813`.
2. The query filters the output to return only their names.
3. The names are displayed as plain text, separated by new lines.

---
#### Use Case

- This command is useful when you need:
  1. A quick list of **NSGs** in a specific resource group.
  2. To use the **NSG names** in subsequent commands or scripts.

---
#### Example Output

If the resource group contains two NSGs named `my-nsg` and `default-nsg`, the output would be:

```plaintext
my-nsg
default-nsg
```

> every VM will have 1 NSG created by default

```sh
az network nsg rule list 
   --resource-group "learn-37910ddf-3b1e-45a8-810b-3e38eb918813" 
   --nsg-name my-vmNSG
```

### Explanation

The command `az network nsg rule list` retrieves a list of **security rules** configured in a specific **Network Security Group (NSG)**.

#### 1. `az network nsg rule list`

   - Lists all the **rules** associated with a specific NSG. 
   - NSG rules define whether network traffic is **allowed** or **denied** for resources (like VMs) connected to the NSG.

---
#### 2. `--resource-group "learn-37910ddf-3b1e-45a8-810b-3e38eb918813"`

   - Specifies the **resource group** where the NSG is located.

---
#### 3. `--nsg-name my-vmNSG`

   - Specifies the name of the **NSG** for which the rules should be listed.
   - In this case, the NSG name is `my-vmNSG`.

---
#### What Happens When This Command Runs?

1. Azure CLI fetches the NSG named `my-vmNSG` within the resource group `learn-37910ddf-3b1e-45a8-810b-3e38eb918813`.
2. It retrieves all the **inbound** and **outbound security rules** configured in that NSG.

---
#### Typical NSG Rule Properties

Each rule in the output will include the following details:
- **Name**: The name of the rule.
- **Priority**: Defines the order of rule processing. Lower numbers have higher priority.
- **Direction**: Specifies whether the rule applies to inbound or outbound traffic.
- **Access**: Specifies whether the rule allows (`Allow`) or denies (`Deny`) traffic.
- **Protocol**: The protocol affected (e.g., TCP, UDP, or `*` for all protocols).
- **Source**: Defines the source IP or subnet.
- **Destination**: Defines the destination IP or subnet.
- **Port Ranges**: Specifies the affected port(s).
- **Description**: An optional description of the rule.

---
#### Use Case

- **View configured rules**:
   - Understand how traffic is filtered or allowed for resources using this NSG.
   - Verify if specific ports (e.g., port 80 for HTTP) are open.

---
#### Example Output

```json
[
  {
    "name": "Allow-HTTP",
    "priority": 100,
    "direction": "Inbound",
    "access": "Allow",
    "protocol": "Tcp",
    "sourceAddressPrefix": "*",
    "destinationAddressPrefix": "*",
    "destinationPortRange": "80",
    "description": "Allow HTTP traffic."
  },
  {
    "name": "Deny-All-Inbound",
    "priority": 65000,
    "direction": "Inbound",
    "access": "Deny",
    "protocol": "*",
    "sourceAddressPrefix": "*",
    "destinationAddressPrefix": "*",
    "destinationPortRange": "*",
    "description": "Default rule to deny all inbound traffic."
  }
]
```

---
#### Follow-Up Actions

- **Modify or Add Rules**:
   - If necessary, add or modify NSG rules to allow desired traffic. For example:

     ```bash
     az network nsg rule create \
       --resource-group "learn-37910ddf-3b1e-45a8-810b-3e38eb918813" \
       --nsg-name my-vmNSG \
       --name Allow-HTTP \
       --priority 100 \
       --direction Inbound \
       --access Allow \
       --protocol Tcp \
       --destination-port-ranges 80 \
       --source-address-prefix '*'
     ```

- **Check Rule Effectiveness**:
   - Ensure that rules are effective by testing connectivity to the VM using tools like `curl`

- **Default Rules**:
   - Azure NSGs have default rules that deny all inbound traffic unless explicitly allowed. Ensure the necessary exceptions (e.g., HTTP, SSH) are configured.

---

```sh
az network nsg rule list 
   --resource-group "learn-37910ddf-3b1e-45a8-810b-3e38eb918813" 
   --nsg-name my-vmNSG 
   --query '[].{Name:name, Priority:priority, Port:destinationPortRange, Access:access}' 
   --output table
```

Output:
```sh
Name              Priority    Port    Access
-----------------  ----------  ------  --------
default-allow-ssh  1000        22      Allow
```

You see the default rule, default-allow-ssh. This rule allows inbound connections over port 22 (SSH). SSH (Secure Shell) is a protocol that's used on Linux to allow administrators to access the system remotely. The priority of this rule is 1000. Rules are processed in priority order, with lower numbers processed before higher numbers.

### Explanation

This Azure CLI command lists the **security rules** in a **Network Security Group (NSG)** and formats the output to show specific details in a table format.

#### **`--query '[].{Name:name, Priority:priority, Port:destinationPortRange, Access:access}'`**
   - Filters and formats the output to only include specific properties for each rule:
     - **`Name`**: The name of the rule.
     - **`Priority`**: The priority of the rule (lower numbers are processed first).
     - **`Port`**: The destination port or range affected by the rule.
     - **`Access`**: Whether the rule allows (`Allow`) or denies (`Deny`) traffic.
   - **`[].`**: Iterates through all rules in the NSG and extracts these specific fields.

---

#### **`--output table`**
   - Formats the output as a **table**, making it easy to read.
   - Each rule will appear as a row, with columns for the selected properties (Name, Priority, Port, Access).

---
#### What Happens When This Command Runs?

1. The CLI retrieves the list of rules in the NSG named `my-vmNSG` within the specified resource group.
2. The output is filtered to display only the **name**, **priority**, **port**, and **access** properties for each rule.
3. The results are presented in a **table format** for better readability.

---
#### Example Output

Here’s what the table might look like:

| Name             | Priority | Port | Access |
| ---------------- | -------- | ---- | ------ |
| Allow-HTTP       | 100      | 80   | Allow  |
| Allow-SSH        | 200      | 22   | Allow  |
| Deny-All-Inbound | 65000    | *    | Deny   |

---
#### Use Case

- Quickly **review NSG rules** to ensure they are configured correctly.
- Identify whether traffic for specific ports (e.g., HTTP on port 80 or SSH on port 22) is allowed.
- Troubleshoot connectivity issues by verifying **access settings** for required ports.

---
## Task 3: Create the network security rule

```sh
az network nsg rule create 
   --resource-group "learn-37910ddf-3b1e-45a8-810b-3e38eb918813" 
   --nsg-name my-vmNSG 
   --name allow-http 
   --protocol tcp 
   --priority 100 
   --destination-port-range 80 
   --access Allow
```

### Explanation

This Azure CLI command **creates a new Network Security Group (NSG) rule** to allow HTTP traffic (port 80) in an NSG.

#### **`az network nsg rule create`**

   - Creates a new **security rule** in the specified Network Security Group (NSG).

---
#### **`--name allow-http`**

   - Assigns a name to the new rule for easy identification.
   - The rule is named `allow-http`.

---
#### **`--protocol tcp`**

   - Specifies the **protocol** that this rule applies to.
   - Here, it allows traffic over the **TCP protocol**.

---
#### **`--priority 100`**

   - Sets the **priority** of the rule. 
   - Lower numbers have higher priority, meaning this rule will be processed **before rules with higher priority values**.
   - Priority ranges from **100 to 4096**, with 100 being the highest priority.

---
#### **`--destination-port-range 80`**

   - Defines the **destination port** that this rule will apply to.
   - Port 80 is typically used for **HTTP traffic**.

---
#### **`--access Allow`**

   - Specifies the action for matching traffic.
   - In this case, the rule will **allow** incoming HTTP traffic.

---
#### What Happens When This Command Runs?

1. A new rule named `allow-http` is created in the NSG `my-vmNSG`.
2. The rule will:
   - Allow **TCP traffic**.
   - Target **port 80** (commonly used for HTTP).
   - Have a **priority of 100**, meaning it will be evaluated before most other rules.
3. This enables **incoming HTTP requests** to reach resources protected by the NSG.

---
#### Use Case

- **Allow Web Traffic**:
  - If you’ve set up a web server (like **Nginx or Apache**) on a virtual machine, you need to allow **port 80** in the NSG to serve HTTP requests.
- **Control Traffic**:
  - Ensures only specific types of traffic are allowed while denying all other types by default.

---
#### Follow-Up Actions

1. **Verify the Rule**:
   - Use the following command to check if the rule was added successfully:

     ```bash
     az network nsg rule list \
       --resource-group "learn-37910ddf-3b1e-45a8-810b-3e38eb918813" \
       --nsg-name my-vmNSG \
       --output table
     ```

2. **Test Connectivity**:
   - Use `curl` or a web browser to test if HTTP traffic can reach your virtual machine:

     ```bash
     curl http://<PUBLIC_IP>
     ```

3. **Remove the Rule** (if needed):
   - To remove this rule, use the following command:

     ```bash
     az network nsg rule delete \
       --resource-group "learn-37910ddf-3b1e-45a8-810b-3e38eb918813" \
       --nsg-name my-vmNSG \
       --name allow-http
     ```

---

Run the same curl command that you ran earlier

```sh
curl --connect-timeout 5 http://$IPADDRESS
```

response:
```sh
<html><body><h2>Welcome to Azure! My name is my-vm.</h2></body></html>
```

