# A simple task runner implemented in Powershell

Param(
    [String]$TaskName, # The name of the task to run
    [parameter(ValueFromRemainingArguments=$true)][String[]]$TaskArgs # The list of repos to run the task on
)

# Define the tasks

$tasks = @{}
$tasks.Add('mon',@{
        description="Runs denon";
        script = {
            denon start
        }
    })
$tasks.Add('dev',@{
        description="Runs dev";
        script = {
            deno run -c tsconfig.json --allow-net --allow-read server.tsx
        }
    })

# Helper functions

# Some helpful strings for formatting output
$indent = (" " * 4);
$spacer = ("-" * 40);

function DisplayHelpText {
    $help_text = Get-Help $MyInvocation.ScriptName
    $syn = $help_text.Synopsis
    Write-Output "Task Runner - runtask TaskName [TaskArgs]"  
    DisplayTaskList
}

function DisplayTaskList{
    Write-Output "List of Tasks: $spacer"
    foreach ($task in $tasks.GetEnumerator()) {
        Write-Output "$indent$($task.Key)"
        Write-Output "$($indent * 2)$($task.Value.description)"
    }
}

# Now process the given task name
if (-not $taskname) {
    DisplayHelpText
    exit
}
$task = $tasks.Get_Item($taskname)
if ($task) {
    Invoke-Command $task.script -ArgumentList (,$TaskArgs)
}
else {
    Write-Output "'$taskname' is not a valid task name."
    DisplayTaskList
}