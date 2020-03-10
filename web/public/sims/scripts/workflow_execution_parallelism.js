// Workflow as a DAG
var workflow_dag_no_ram =
{
    "edges": [
        {
            "source": "task0.in",
            "target": "task0"
        },
        {
            "source": "task0",
            "target": "task0.out"
        },
        {
            "source": "task1.in",
            "target": "task1"
        },
        {
            "source": "task1",
            "target": "task1.out"
        },
        {
            "source": "task10.in",
            "target": "task10"
        },
        {
            "source": "task10",
            "target": "task10.out"
        },
        {
            "source": "task11.in",
            "target": "task11"
        },
        {
            "source": "task11",
            "target": "task11.out"
        },
        {
            "source": "task12.in",
            "target": "task12"
        },
        {
            "source": "task12",
            "target": "task12.out"
        },
        {
            "source": "task13.in",
            "target": "task13"
        },
        {
            "source": "task13",
            "target": "task13.out"
        },
        {
            "source": "task14.in",
            "target": "task14"
        },
        {
            "source": "task14",
            "target": "task14.out"
        },
        {
            "source": "task15.in",
            "target": "task15"
        },
        {
            "source": "task15",
            "target": "task15.out"
        },
        {
            "source": "task16.in",
            "target": "task16"
        },
        {
            "source": "task16",
            "target": "task16.out"
        },
        {
            "source": "task17.in",
            "target": "task17"
        },
        {
            "source": "task17",
            "target": "task17.out"
        },
        {
            "source": "task18.in",
            "target": "task18"
        },
        {
            "source": "task18",
            "target": "task18.out"
        },
        {
            "source": "task19.in",
            "target": "task19"
        },
        {
            "source": "task19",
            "target": "task19.out"
        },
        {
            "source": "task2.in",
            "target": "task2"
        },
        {
            "source": "task2",
            "target": "task2.out"
        },
        {
            "source": "task0.out",
            "target": "task20"
        },
        {
            "source": "task1.out",
            "target": "task20"
        },
        {
            "source": "task3.out",
            "target": "task20"
        },
        {
            "source": "task4.out",
            "target": "task20"
        },
        {
            "source": "task5.out",
            "target": "task20"
        },
        {
            "source": "task6.out",
            "target": "task20"
        },
        {
            "source": "task7.out",
            "target": "task20"
        },
        {
            "source": "task8.out",
            "target": "task20"
        },
        {
            "source": "task9.out",
            "target": "task20"
        },
        {
            "source": "task10.out",
            "target": "task20"
        },
        {
            "source": "task11.out",
            "target": "task20"
        },
        {
            "source": "task12.out",
            "target": "task20"
        },
        {
            "source": "task13.out",
            "target": "task20"
        },
        {
            "source": "task14.out",
            "target": "task20"
        },
        {
            "source": "task15.out",
            "target": "task20"
        },
        {
            "source": "task16.out",
            "target": "task20"
        },
        {
            "source": "task17.out",
            "target": "task20"
        },
        {
            "source": "task18.out",
            "target": "task20"
        },
        {
            "source": "task19.out",
            "target": "task20"
        },
        {
            "source": "task2.out",
            "target": "task20"
        },
        {
            "source": "task20",
            "target": "task20.out"
        },
        {
            "source": "task3.in",
            "target": "task3"
        },
        {
            "source": "task3",
            "target": "task3.out"
        },
        {
            "source": "task4.in",
            "target": "task4"
        },
        {
            "source": "task4",
            "target": "task4.out"
        },
        {
            "source": "task5.in",
            "target": "task5"
        },
        {
            "source": "task5",
            "target": "task5.out"
        },
        {
            "source": "task6.in",
            "target": "task6"
        },
        {
            "source": "task6",
            "target": "task6.out"
        },
        {
            "source": "task7.in",
            "target": "task7"
        },
        {
            "source": "task7",
            "target": "task7.out"
        },
        {
            "source": "task8.in",
            "target": "task8"
        },
        {
            "source": "task8",
            "target": "task8.out"
        },
        {
            "source": "task9.in",
            "target": "task9"
        },
        {
            "source": "task9",
            "target": "task9.out"
        }
    ],
    "vertices": [
        {
            "flops": 3.6e+15,
            "id": "task0",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task1",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task10",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task11",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task12",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task13",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task14",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task15",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task16",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task17",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task18",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task19",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task2",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 300000000000000.0,
            "id": "task20",
            "max_cores": 1,
            "memory": 42000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task3",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task4",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task5",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task6",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task7",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task8",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task9",
            "max_cores": 1,
            "memory": 4000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "id": "task0.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task0.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task1.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task1.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task10.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task10.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task11.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task11.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task12.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task12.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task13.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task13.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task14.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task14.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task15.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task15.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task16.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task16.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task17.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task17.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task18.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task18.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task19.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task19.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task2.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task2.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task20.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task3.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task3.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task4.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task4.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task5.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task5.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task6.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task6.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task7.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task7.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task8.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task8.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task9.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task9.out",
            "size": 2000000000.0,
            "type": "file"
        }
    ]
};
//////////

var workflow_dag_uses_ram =
{
    "edges": [
        {
            "source": "task0.in",
            "target": "task0"
        },
        {
            "source": "task0",
            "target": "task0.out"
        },
        {
            "source": "task1.in",
            "target": "task1"
        },
        {
            "source": "task1",
            "target": "task1.out"
        },
        {
            "source": "task10.in",
            "target": "task10"
        },
        {
            "source": "task10",
            "target": "task10.out"
        },
        {
            "source": "task11.in",
            "target": "task11"
        },
        {
            "source": "task11",
            "target": "task11.out"
        },
        {
            "source": "task12.in",
            "target": "task12"
        },
        {
            "source": "task12",
            "target": "task12.out"
        },
        {
            "source": "task13.in",
            "target": "task13"
        },
        {
            "source": "task13",
            "target": "task13.out"
        },
        {
            "source": "task14.in",
            "target": "task14"
        },
        {
            "source": "task14",
            "target": "task14.out"
        },
        {
            "source": "task15.in",
            "target": "task15"
        },
        {
            "source": "task15",
            "target": "task15.out"
        },
        {
            "source": "task16.in",
            "target": "task16"
        },
        {
            "source": "task16",
            "target": "task16.out"
        },
        {
            "source": "task17.in",
            "target": "task17"
        },
        {
            "source": "task17",
            "target": "task17.out"
        },
        {
            "source": "task18.in",
            "target": "task18"
        },
        {
            "source": "task18",
            "target": "task18.out"
        },
        {
            "source": "task19.in",
            "target": "task19"
        },
        {
            "source": "task19",
            "target": "task19.out"
        },
        {
            "source": "task2.in",
            "target": "task2"
        },
        {
            "source": "task2",
            "target": "task2.out"
        },
        {
            "source": "task3.out",
            "target": "task20"
        },
        {
            "source": "task1.out",
            "target": "task20"
        },
        {
            "source": "task0.out",
            "target": "task20"
        },
        {
            "source": "task2.out",
            "target": "task20"
        },
        {
            "source": "task4.out",
            "target": "task20"
        },
        {
            "source": "task5.out",
            "target": "task20"
        },
        {
            "source": "task6.out",
            "target": "task20"
        },
        {
            "source": "task7.out",
            "target": "task20"
        },
        {
            "source": "task8.out",
            "target": "task20"
        },
        {
            "source": "task17.out",
            "target": "task20"
        },
        {
            "source": "task9.out",
            "target": "task20"
        },
        {
            "source": "task10.out",
            "target": "task20"
        },
        {
            "source": "task11.out",
            "target": "task20"
        },
        {
            "source": "task12.out",
            "target": "task20"
        },
        {
            "source": "task13.out",
            "target": "task20"
        },
        {
            "source": "task14.out",
            "target": "task20"
        },
        {
            "source": "task15.out",
            "target": "task20"
        },
        {
            "source": "task16.out",
            "target": "task20"
        },
        {
            "source": "task18.out",
            "target": "task20"
        },
        {
            "source": "task19.out",
            "target": "task20"
        },
        {
            "source": "task20",
            "target": "task20.out"
        },
        {
            "source": "task3.in",
            "target": "task3"
        },
        {
            "source": "task3",
            "target": "task3.out"
        },
        {
            "source": "task4.in",
            "target": "task4"
        },
        {
            "source": "task4",
            "target": "task4.out"
        },
        {
            "source": "task5.in",
            "target": "task5"
        },
        {
            "source": "task5",
            "target": "task5.out"
        },
        {
            "source": "task6.in",
            "target": "task6"
        },
        {
            "source": "task6",
            "target": "task6.out"
        },
        {
            "source": "task7.in",
            "target": "task7"
        },
        {
            "source": "task7",
            "target": "task7.out"
        },
        {
            "source": "task8.in",
            "target": "task8"
        },
        {
            "source": "task8",
            "target": "task8.out"
        },
        {
            "source": "task9.in",
            "target": "task9"
        },
        {
            "source": "task9",
            "target": "task9.out"
        }
    ],
    "vertices": [
        {
            "flops": 3.6e+15,
            "id": "task0",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task1",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task10",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task11",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task12",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task13",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task14",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task15",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task16",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task17",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task18",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task19",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task2",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 300000000000000.0,
            "id": "task20",
            "max_cores": 1,
            "memory": 54000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task3",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task4",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task5",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task6",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task7",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task8",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "flops": 3.6e+15,
            "id": "task9",
            "max_cores": 1,
            "memory": 16000000000.0,
            "min_cores": 1,
            "parallel_efficiency": 1.0,
            "type": "task"
        },
        {
            "id": "task0.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task0.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task1.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task1.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task10.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task10.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task11.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task11.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task12.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task12.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task13.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task13.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task14.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task14.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task15.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task15.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task16.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task16.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task17.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task17.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task18.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task18.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task19.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task19.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task2.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task2.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task20.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task3.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task3.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task4.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task4.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task5.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task5.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task6.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task6.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task7.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task7.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task8.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task8.out",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task9.in",
            "size": 2000000000.0,
            "type": "file"
        },
        {
            "id": "task9.out",
            "size": 2000000000.0,
            "type": "file"
        }
    ]
};
/////////

$(function() {

    // Set only 1 compute node on the SVG to be visible in the beginning
    for (let i = 2; i <= 5; i++) {
        $("#compute-node-" + i).css("display", "none");
    }

    // Show the workflow, and update if the user wants to use the Workflow where tasks use RAM
    generate_workflow_dag(workflow_dag_no_ram);

    $("#ram-required").on("click", function() {
        $("#workflow-dag-chart > svg").remove();
       if ($(this).is(":checked")) {
           generate_workflow_dag(workflow_dag_uses_ram);
       } else {
           generate_workflow_dag(workflow_dag_no_ram);
       }
    });

    // As the user enters some number of desired compute nodes, update the
    // platform SVG to illustrate the change.
    $("#num-nodes").on("keyup", function() {
        let num_nodes_input_el = $(this);
        let num_nodes_input_value = parseInt(num_nodes_input_el.val());
        let num_nodes_label_el = $("#num-nodes-label");

        if (num_nodes_input_value >= 1 && num_nodes_input_value <= 5) {
            num_nodes_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            // Update the number of compute nodes that are visible on the SVG
            for (var i = 1; i <= 5; i++) {
                if (i <= num_nodes_input_value) {
                    $("#compute-node-" + i).css("display", "block");
                } else {
                    $("#compute-node-" + i).css("display", "none");
                }
            }

            // Update the label that says how many compute nodes are to be used
            num_nodes_label_el.text(num_nodes_input_value + " x Compute Nodes")
                .css("background-color", "#d3ffe9");

            setTimeout(function() {
                if (num_nodes_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    num_nodes_label_el.css("background-color", "");
                }
            }, 500);

        } else {
            num_nodes_input_el.removeClass("is-valid")
                .addClass("is-invalid");

            num_nodes_label_el.css("background-color", "#ffb7b5");
        }
    });

    // Update the label that says how many cores each compute node has
    $("#num-cores").on("keyup", function() {
        let num_cores_input_el = $(this);
        let num_cores_input_value = parseInt(num_cores_input_el.val());
        let num_cores_label_el = $(".num-cores-label");

        if (num_cores_input_value >= 1 && num_cores_input_value <= 32) {

            num_cores_label_el.text("Cores: " + num_cores_input_value)
                .css("background-color", "#d3ffe9");

            num_cores_input_el.removeClass("is-invalid")
                .addClass("is-valid");

            setTimeout(function() {
                if (num_cores_label_el.css("background-color") == "rgb(211, 255, 233)") {
                    num_cores_label_el.css("background-color", "");
                }
            }, 500);
        } else {
            num_cores_label_el.css("background-color", "#ffb7b5");
            num_cores_input_el.removeClass("is-valid")
                .addClass("is-invalid");
        }
    });

    $('#simulator-form').on('submit', function(event) {
        // we don't want the page reloading, so things look dynamic (this will be nice when we use d3's transitions)
        event.preventDefault();
        disableRunSimulationButton();

        $('.chart').css('display', 'block');

        // remove the graphs, since we will append a new ones to the chart
        $('.chart > svg').remove();

        // Upon submission of the form, a POST request containing the user's desired parameters
        // is sent to the node server, where the simulation will be executed with those parameters.
        // Then a response with simulation data is received. The data is parsed, and rendered on the
        // screen. 
        $.ajax({
            url: '/run/workflow_execution_parallelism',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(
                {
                    num_nodes: $("#num-nodes").val(),
                    num_cores_per_node: $("#num-cores").val(),
                    ram_required: $('#ram-required').is(':checked') ? 1 : 0
                }),

                success: function(response) {

                    // Add the new simulation output into the "Simulation Output" section
                    $("#simulation-output").empty()
                        .append(response.simulation_output);

                    generate_host_utilization_graph(response.task_data);

                    generate_workflow_execution_graph(response.task_data);

                    populateWorkflowTaskDataTable(response.task_data);
                }
        });
    });
});
