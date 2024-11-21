import xml.etree.ElementTree as ET
from pyang import context, repository
from pyang import statements
import random


def generate_sample_value(yang_type: str):
    """Generate a sample value based on the YANG type."""
    if yang_type == "string":
        return f"sample-{random.randint(100, 999)}"
    elif yang_type == "boolean":
        return random.choice(["true", "false"])
    elif yang_type == "int32" or yang_type == "int64":
        return str(random.randint(-1000, 1000))
    elif yang_type == "uint32" or yang_type == "uint64":
        return str(random.randint(0, 1000))
    elif yang_type == "enumeration":
        return "enum-value"
    else:
        return "sample-value"


def process_statements(parent, yang_statements, groupings=None):
    """
    Process YANG statements recursively and handle groupings, tagged structures, and switch-case logic.
    """
    if groupings is None:
        groupings = {}

    for stmt in yang_statements:
        if isinstance(stmt, statements.Statement):
            if stmt.keyword == "grouping":
                # Store grouping for later use
                groupings[stmt.arg] = stmt.substmts

            elif stmt.keyword == "uses":
                # Use a grouping
                grouping_name = stmt.arg
                if grouping_name in groupings:
                    process_statements(parent, groupings[grouping_name], groupings)

            elif stmt.keyword in ["choice"]:
                # Handle choice/case
                choice_elem = ET.SubElement(parent, stmt.arg)
                cases = [case for case in stmt.substmts if case.keyword == "case"]
                if cases:
                    selected_case = random.choice(cases)  # Randomly pick one case
                    process_statements(choice_elem, selected_case.substmts, groupings)

            elif stmt.keyword == "container":
                # Generate container element
                container = ET.SubElement(parent, stmt.arg)
                process_statements(container, stmt.substmts, groupings)

            elif stmt.keyword == "list":
                # Generate multiple instances of a list element
                for i in range(random.randint(1, 3)):
                    list_elem = ET.SubElement(parent, stmt.arg)
                    process_statements(list_elem, stmt.substmts, groupings)

            elif stmt.keyword == "leaf":
                # Generate leaf element
                elem = ET.SubElement(parent, stmt.arg)
                elem.text = generate_sample_value(
                    stmt.search_one("type").arg if stmt.search_one("type") else "string"
                )

            elif stmt.keyword == "leaf-list":
                # Generate multiple leaf-list elements
                for _ in range(random.randint(1, 3)):
                    elem = ET.SubElement(parent, stmt.arg)
                    elem.text = generate_sample_value(
                        stmt.search_one("type").arg if stmt.search_one("type") else "string"
                    )


def yang_to_sample_xml(yang_file: str, root_element: str, num_samples: int = 3):
    """
    Generate multiple XML samples based on a YANG file, supporting groupings, tagged structures, and switch-case.
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

        # Process statements and generate XML
        process_statements(root, module.substmts)

        # Add to sample list
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
