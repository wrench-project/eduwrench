#include <wrench.h>
#include "ThrustDJobScheduler.h"
#include <nlohmann/json.hpp>
#include <fstream>

int main(int argc, char **argv) {

    if (argc != 2) {
        std::cerr << "Usage: " << argv[0] << " <json workflow file>" << std::endl;
        exit(1);
    }

    auto workflow_file = argv[1];

    wrench::Workflow *workflow;
    workflow = wrench::PegasusWorkflowParser::createWorkflowFromJSON(workflow_file, "1f", false,
                                                                     4, 4, true);

    std::vector<wrench::WorkflowFile*> files[8];
    int numFiles[8] = {0, 0, 0, 0, 0, 0, 0, 0};
    int numTasks[8] = {0, 0, 0, 0, 0, 0, 0, 0};
    double numFlops[8] = {0, 0, 0, 0, 0, 0, 0, 0};

    for (auto const &t : workflow->getTasks()) {
        numTasks[t->getTopLevel()]++;
        numFlops[t->getTopLevel()] += t->getFlops();
        for (auto const &f : t->getInputFiles()) {
            files[t->getTopLevel()].push_back(f);
            numFiles[t->getTopLevel()]++;
        }
    }

    double sizes[8];

    for(int i = 0; i < 8; i++) {
        for (auto const &f : files[i]) {
            sizes[i] += f->getSize();
        }
    }

    for (int i = 0; i < 8; i++) {
        std::cerr << "Before level " << i << ": " << numFiles[i] << " files, total size: " << sizes[i] / 1000000 << " MB" << std::endl;
        std::cerr << "At level " << i << ": " << numTasks[i] << " tasks, total Flops: " << numFlops[i] << " Flops" << std::endl;
    }
}

