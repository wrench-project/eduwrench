let hostUtilizationData = {
    data: null,
    containedId: '',
    hostsList: [],
    diskHostsList: []
}

$('.host-utilization.checkbox')
    .checkbox({
        onChecked: function () {
            generateHostUtilizationChart(
                hostUtilizationData.data,
                hostUtilizationData.containedId,
                hostUtilizationData.hostsList,
                hostUtilizationData.diskHostsList,
                true);
        },
        onUnchecked: function () {
            generateHostUtilizationChart(
                hostUtilizationData.data,
                hostUtilizationData.containedId,
                hostUtilizationData.hostsList,
                hostUtilizationData.diskHostsList,
                false);
        }
    });
