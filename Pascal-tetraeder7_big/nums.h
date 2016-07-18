#include<iostream>
#include<cstdlib>
#include<algorithm>
using namespace std;
int Num1[4096],Num2[4096],Sum[10000],Mul[10000];
string c1,c2;
void t()
{
    int s1=c1.size(),s2=c2.size();
    for(int i=s1-1;i>=0;i--)
        Num1[i]=(c1[s1-i-1]-'0');
    for(int i=s2-1;i>=0;i--)
        Num2[i]=(c2[s2-i-1]-'0');
}
void sum()
{
    int s1=c1.size(),s2=c2.size();
    int temp=0,j=max(s1,s2);
    for(int i=0;i<j;i++)
    {
        Sum[i]=(Num1[i]+Num2[i]+temp)%10;
        temp=(Num1[i]+Num2[i]+temp)/10;
    }
    while(temp){Sum[j++]=temp%10;temp/=10;}
}
void mul()
{
    int s1=c1.size(),s2=c2.size();
    int temp,k,m=0;
    for(int i=0;i<s1;i++)
    {
        temp=0;
        for(int j=0;j<s2;j++)
        {
            Mul[i+j]+=(Num1[i]*Num2[j]+temp)%10;
            temp=(Num1[i]*Num2[j]+temp)/10;
        }
        k=i+s2;
        while(temp){Mul[k++]+=temp%10;temp/=10;}
        m=max(m,k);
    }
    for(int i=m;i>0;i--)
    {
        if(Mul[i]>9)
        {
            Mul[i-1]+=Mul[i]/10;
            Mul[i]%=10;
        }
    }
}
void print()
{
    int j;
    for(int i=9999;i>=0;i--)
        if(Sum[i]){j=i;break;}
    cout<<"Sum:\n";
    for(int i=j;i>=0;i--)
        cout<<Sum[i];
    cout<<"\n*************************************************************************\n";
    cout<<"Mul:\n";
    for(int i=9999;i>=0;i--)
        if(Mul[i]){j=i;break;}
    for(int i=j;i>=0;i--)
        cout<<Mul[i];
    cout<<"\n*************************************************************************\n";
}