const STATUS=
{
PENDING:"pending",
IN_PROGRESS:"in progress",
COMPLETED:"completed"
}
const PRIORITY=
{
    HIGH:"high",
    LOW:"low",
    MEDIUM:"medium"

}
const ENUM_TASK_STATUS = Object.values(STATUS)
const ENUM_PRIORITY=Object.values(PRIORITY)
module.exports={
    ENUM_TASK_STATUS,
    ENUM_PRIORITY,
    PRIORITY,
    STATUS
}