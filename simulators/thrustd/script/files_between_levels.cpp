#include <wrench.h>
#include "ThrustDJobScheduler.h"
#include <nlohmann/json.hpp>
#include <fstream>

#define GFLOPS (1000.0*1000.0*1000.0)

int main(int argc, char **argv) {

    if (argc != 2) {
        std::cerr << "Usage: " << argv[0] << " <json workflow file>" << std::endl;
        exit(1);
    }

    auto workflow_file = argv[1];

    std::string reference_speed = "43Gf";

    auto workflow = wrench::WfCommonsWorkflowParser::createWorkflowFromJSON(workflow_file, reference_speed, false,
                                                                     4, 4, true);


//    std::vector<wrench::WorkflowFile*> files[8];
//    int numFiles[8] = {0, 0, 0, 0, 0, 0, 0, 0};
//    int numTasks[8] = {0, 0, 0, 0, 0, 0, 0, 0};
//    double numFlops[8] = {0, 0, 0, 0, 0, 0, 0, 0};
//
//    for (auto const &t : workflow->getTasks()) {
//        numTasks[t->getTopLevel()]++;
//        numFlops[t->getTopLevel()] += t->getFlops();
//        for (auto const &f : t->getInputFiles()) {
//            files[t->getTopLevel()].push_back(f);
//            numFiles[t->getTopLevel()]++;
//        }
//    }
//
//    double sizes[8];
//
//    for(int i = 0; i < 8; i++) {
//        for (auto const &f : files[i]) {
//            sizes[i] += f->getSize();
//        }
//    }

    std::cerr << "Total number of tasks: " << workflow->getNumberOfTasks() << "\n";
    std::cerr << "Total number of levels: " << workflow->getNumLevels() << "\n";
    for (int i = 0; i < workflow->getNumLevels(); i++) {
        std::cerr << "   Level " << i << ": " << workflow->getTasksInTopLevelRange(i, i).size() << "\n";
    }
    double footprint = 0;
    for (auto const &f : workflow->getFileMap()) {
        footprint += f.second->getSize();
    }
    std::cerr << "Data footprint (kB): " << footprint/(1000) << "\n";
    std::cerr << "Data footprint (MB): " << footprint/(1000*1000) << "\n";
    std::cerr << "Data footprint (GB): " << footprint/(1000 * 1000 * 1000) << "\n";

//    for (int i = 0; i < 8; i++) {
//        std::cerr << "Before level " << i << ": " << numFiles[i] << " files, total size: " << sizes[i] / 1000000 << " MB" << std::endl;
//        std::cerr << "At level " << i << ": " << numTasks[i] << " tasks, total work: " << (numFlops[i]/GFLOPS) << " GFlops" << std::endl;
//    }
}

