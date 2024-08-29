# Define the list of common kubectl commands for troubleshooting logs
kubectl_commands = [
    "kubectl get pods",
    "kubectl get events",
    "kubectl describe pod",
    "kubectl logs",
    "kubectl get nodes",
    "kubectl describe node",
    "kubectl top pod",
    "kubectl top node",
    "kubectl get svc",
    "kubectl get deployments",
    "kubectl get configmaps",
    "kubectl get secrets",
    "kubectl get pvc",
    "kubectl describe pvc",
    "kubectl get ingress",
    "kubectl describe ingress"
]

# Function to append a given text to all kubectl commands
def append_text_to_kubectl_commands(commands, text):
    return [f"{command} {text}" for command in commands]

# Given text to append (for example: specific namespace or pod name)
given_text = "--namespace=my-namespace"

# Append the given text to each kubectl command
updated_commands = append_text_to_kubectl_commands(kubectl_commands, given_text)

# Print the updated commands
for command in updated_commands:
    print(command)
