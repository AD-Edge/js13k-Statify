$DateStart = '2018-01-31'
$DateEnd = '2018-02-05'


# Variables Set
$StartDT = Get-Date -Date $DateStart
$EndDT   = Get-Date -Date $DateEnd
$DayCount = ($EndDT - $StartDT).Days

# Return Date List during designated period 
foreach ($DC_Item in 0..$DayCount)
    {
    $StartDT.AddDays($DC_Item).ToString('yyyy-MM-dd')
}