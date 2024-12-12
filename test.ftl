<#function getValuesByPath xml path>
    <#-- Parse XML -->
    <#assign document = xml?interpretXml>
    
    <#-- Split the path -->
    <#assign nodes = path?split("/")>
    
    <#-- Traverse the XML -->
    <#assign current = document>
    <#list nodes as node>
        <#if current?hasContent>
            <#assign current = current[node]>
        </#if>
    </#list>
    
    <#-- Collect values -->
    <#list current as item>
        <#if item?isNode>
            <#assign result = result + [item?string]>
        </#if>
    </#list>
    <#return result>
</#function>

<#-- Use Function -->
<#assign xmlContent = file.readFile("/mnt/data/file-SUei9QgeABgLt8S5rrZexz")>
<#assign path = "maintenance-domain/maintenance-associations/maintenance-association-end-point">
<#assign values = getValuesByPath(xmlContent, path)>
