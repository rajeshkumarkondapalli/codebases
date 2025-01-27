
<#assign localMeter = "1R2C_SomeClass-123_v01">
<#assign isLocalMeterFound = false>
<#assign outputs = {} />

<#if localMeter?matches("^1R2C_(?<svcClass>[A-Za-z]+)-(?<cir>\\d+)_v01$")>
    <#assign isLocalMeterFound = true>
    <#assign svcClass = localMeter?groups["svcClass"]>
    <#assign cir = localMeter?groups["cir"]>
</#if>

<#if isLocalMeterFound>
    <#assign outputs["cos"] = "Logic to compute COS based on svcClass">
    <#assign outputs["cin"] = cir?number>
</#if>

<!-- Debug output -->
<pre>
isLocalMeterFound: ${isLocalMeterFound}
cos: ${outputs["cos"]!}
cin: ${outputs["cin"]!}
</pre>





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
