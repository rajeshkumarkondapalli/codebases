import xml.etree.ElementTree as ET
from pyang import context, repository
from pyang import statements
import random


def generate_sample_value(yang_type: str):
    """
    Generate a sample value based on the YANG type.
    """
    if yang_type == "string":
        return f"sample-{random.randint(100, 999)}"
    elif yang_type == "boolean":
        return random.choice(["true", "false"])
    elif yang_type == "int32" or yang_type == "int64":
        return str(random.randint(-1000, 1000))
    elif yang_type == "uint32" or yang_type == "uint64":
        return str(random.randint(0, 1000))
    else:
        return "sample-value"


def yang_to_sample_xml(yang_file: str, root_element: str, num_samples: int = 3):
    """
    Generate multiple XML samples based on a YANG file.
    """
    # Set up the repository and context
    repo = repository.FileRepository(".")
    ctx = context.Context(repo)

    # Parse the YANG file
    with open(yang_file, "r") as yang_fd:
        module = ctx.add_module(yang_file, yang_fd.read())

    if not module:
        raise Exception(f"Failed to parse the YANG file: {yang_file}")

    # Generate multiple XML samples
    samples = []
    for _ in range(num_samples):
        # Create an XML root element
        root = ET.Element(root_element)

        # Recursively process the YANG statements to generate XML structure
        def process_statements(parent, yang_statements):
            for stmt in yang_statements:
                if isinstance(stmt, statements.Statement):
                    if stmt.keyword in ["leaf", "leaf-list"]:
                        # Generate a sample value for leaves
                        elem = ET.SubElement(parent, stmt.arg)
                        elem.text = generate_sample_value(stmt.search_one("type").arg if stmt.search_one("type") else "string")
                    elif stmt.keyword in ["container"]:
                        # Generate a container element
                        container = ET.SubElement(parent, stmt.arg)
                        process_statements(container, stmt.substmts)
                    elif stmt.keyword in ["list"]:
                        # Generate multiple instances of a list element
                        for i in range(random.randint(1, 3)):
                            list_elem = ET.SubElement(parent, stmt.arg)
                            process_statements(list_elem, stmt.substmts)

        process_statements(root, module.substmts)
        samples.append(ET.tostring(root, encoding="unicode", method="xml"))

    return samples


if __name__ == "__main__":
    yang_file = "example.yang"  # Path to your YANG file
    root_element = "data"       # Root element name for the generated XML
    num_samples = 3             # Number of samples to generate

    try:
        xml_samples = yang_to_sample_xml(yang_file, root_element, num_samples)
        for i, sample in enumerate(xml_samples, start=1):
            print(f"Sample {i}:\n{sample}\n")
    except Exception as e:
        print(f"Error: {e}")
