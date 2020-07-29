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
    filereader.open("magoosh.txt");

    ofstream filewriter;
    filewriter.open("magooshscript.js");

    filewriter<<"var magooshwords=[];\nvar magooshmeanings=[];"<<endl;

    int index=0;
    if(filereader.is_open() && filewriter.is_open()){
        string line;
        string meaning;
        while(getline(filereader,line)){
            getline(filereader,meaning);

            filewriter<<"magooshwords["<<index<<"]=\""<<trim(line)<<"\";"<<endl;
            filewriter<<"magooshmeanings["<<index<<"]=\""<<trim(meaning)<<"\";"<<endl;

            index++;
        }
    }
    filereader.close();
    filewriter.close();

    return 0;
}
