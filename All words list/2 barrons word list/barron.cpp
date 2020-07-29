#include <iostream>
#include <fstream>
#include <string>

using namespace std;

std::string& ltrim(std::string& str, const std::string& chars = "\t\n\v\f\r ")
{
    str.erase(0, str.find_first_not_of(chars));
    return str;
}

std::string& rtrim(std::string& str, const std::string& chars = "\t\n\v\f\r ")
{
    str.erase(str.find_last_not_of(chars) + 1);
    return str;
}

std::string& trim(std::string& str, const std::string& chars = "\t\n\v\f\r ")
{
    return ltrim(rtrim(str, chars), chars);
}


int main()
{
    ifstream filereader;
    filereader.open("barron.txt");

    ofstream filewriter;
    filewriter.open("barronscript.js");

    filewriter<<"var barronwords=[];\nvar barronmeanings=[];"<<endl;

    int index=0;
    if(filereader.is_open() && filewriter.is_open()){
        string line;
        string meaning;
        while(getline(filereader,line)){
            getline(filereader,meaning);

            filewriter<<"barronwords["<<index<<"]=\""<<trim(line)<<"\";"<<endl;
            filewriter<<"barronmeanings["<<index<<"]=\""<<trim(meaning)<<"\";"<<endl;

            index++;
        }
    }
    filereader.close();
    filewriter.close();

    return 0;
}
